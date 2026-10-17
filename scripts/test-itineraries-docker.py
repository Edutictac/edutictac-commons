#!/usr/bin/env python3
"""Validate image upgrade and SQLite restore using disposable Docker resources."""
import argparse
import http.cookiejar
import json
import os
import secrets
import subprocess
import time
import urllib.error
import urllib.request


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--id-image", required=True)
    parser.add_argument("--portal-image", required=True)
    parser.add_argument("--previous-id-image", required=True)
    args = parser.parse_args()
    name = "commons-itineraries-check-" + secrets.token_hex(5)
    api, portal, volume, network = [name + suffix for suffix in ("-api", "-portal", "-data", "-net")]
    env = {**os.environ, "EDUTICTAC_ID_SECRET": secrets.token_hex(32),
           "EDUTICTAC_ID_TEACHER_TOKEN": secrets.token_hex(32)}

    def docker(*arguments, script=None):
        result = subprocess.run(["docker", *arguments], input=script, capture_output=True, text=True, env=env)
        if result.returncode:
            raise RuntimeError("Docker operation failed: " + " ".join(arguments[:2]))
        return result.stdout.strip()

    def call(opener, path, body=None, method=None, status=200):
        request = urllib.request.Request(base + path,
            data=json.dumps(body).encode() if body is not None else None,
            headers={"Content-Type": "application/json"}, method=method)
        try:
            response = opener.open(request, timeout=10)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            assert response.status == status, f"Unexpected HTTP {response.status} at {path}"
            return json.load(response)

    def ready():
        for _ in range(60):
            try:
                with urllib.request.urlopen(base + "/api/health", timeout=2) as response:
                    if response.status == 200:
                        return
            except (OSError, urllib.error.URLError):
                pass
            time.sleep(0.5)
        raise RuntimeError("Temporary stack did not become ready")

    try:
        docker("network", "create", network)
        docker("volume", "create", volume)
        docker("run", "--rm", "--pull=never", "-i", "--network=none", "-v", volume + ":/data",
               "-e", "EDUTICTAC_ID_DB=/data/id.db", args.previous_id_image, "python", "-", script='''
import main
with main.get_conn() as conn:
    assert not conn.execute("SELECT 1 FROM sqlite_master WHERE name='group_itinerary_selection'").fetchone()
    conn.execute("INSERT INTO groups VALUES ('group', 'GSYNTH', 'synthetic', 'teacher-token', '2026-09-01', '2026-09-01')")
    for aid in ['a', 'b']:
        conn.execute("INSERT INTO activity_assignments (id, app_id, activity_id, title, group_id, created_by_teacher_id, created_at, updated_at) VALUES (?, 'play', ?, ?, 'group', 'teacher-token', '2026-09-01', '2026-09-01')", (aid, aid, aid))
    for iid, title, ts, steps in [('first', 'Ciències', '2026-09-01', ['a','b']), ('second', 'Lectura', '2026-09-02', ['b','a'])]:
        conn.execute("INSERT INTO itineraries VALUES (?, ?, 'group', 'teacher-token', 1, ?, ?)", (iid, title, ts, ts))
        for position, aid in enumerate(steps):
            conn.execute("INSERT INTO itinerary_items VALUES (?, ?, ?, ?)", (iid, aid, position, ts))
    conn.execute("INSERT INTO student_identities (id, group_id, public_code, pin_hash, created_at, updated_at) VALUES ('pupil', 'group', 'ABC', ?, '2026-09-01', '2026-09-01')", (main.hash_pin('1234'),))
    conn.execute("INSERT INTO scores (id, identity_id, assignment_id, app_id, activity_id, score, created_at) VALUES ('score', 'pupil', 'a', 'play', 'a', 90, '2026-09-01')")
''')
        docker("run", "-d", "--pull=never", "--name", api, "--network", network, "--network-alias", "id-api",
               "-v", volume + ":/data", "-e", "EDUTICTAC_ID_DB=/data/id.db", "-e", "EDUTICTAC_ID_SECRET",
               "-e", "EDUTICTAC_ID_TEACHER_TOKEN", "-e", "EDUTICTAC_ID_COOKIE_SECURE=0",
               "-e", "QUIOSC_MODE=disabled", args.id_image)
        docker("run", "-d", "--pull=never", "--name", portal, "--network", network,
               "-p", "127.0.0.1::80", args.portal_image)
        port = docker("port", portal, "80").rsplit(":", 1)[1]
        base = "http://127.0.0.1:" + port
        ready()
        teacher = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
        student = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
        call(teacher, "/api/teacher/login", {"token": env["EDUTICTAC_ID_TEACHER_TOKEN"]})
        call(student, "/api/auth/student", {"public_code": "ABC", "pin": "1234"})
        dashboard = call(student, "/api/student/dashboard")
        assert dashboard["selected_itinerary"] == {"id": "second", "title": "Lectura"}
        assert [item["id"] for item in dashboard["assignments"]] == ["b", "a"]
        call(teacher, "/api/teacher/groups/group/itinerary", {"itinerary_id": "first", "expected_itinerary_id": "second"}, "PUT")
        call(teacher, "/api/teacher/itineraries/first/items",
             {"assignment_ids": ["b", "a"], "expected_assignment_ids": ["a", "b"]}, "PUT")
        call(urllib.request.build_opener(), "/api/teacher/groups/group/itinerary",
             {"itinerary_id": None, "expected_itinerary_id": "first"}, "PUT", status=401)
        docker("exec", "-i", api, "python", "-", script='''
import sqlite3
with sqlite3.connect('/data/id.db') as source, sqlite3.connect('/data/restore-probe.db') as target:
    source.backup(target)
''')
        call(teacher, "/api/teacher/groups/group/itinerary", {"itinerary_id": None, "expected_itinerary_id": "first"}, "PUT")
        assert call(student, "/api/student/dashboard")["selected_itinerary"] is None
        docker("stop", api)
        docker("run", "--rm", "--pull=never", "-i", "--network=none", "-v", volume + ":/data",
               "-e", "EDUTICTAC_ID_DB=/data/id.db", args.id_image, "python", "-", script='''
import sqlite3
with sqlite3.connect('/data/restore-probe.db') as source, sqlite3.connect('/data/id.db') as target:
    source.backup(target)
''')
        docker("start", api)
        ready()
        restored = call(student, "/api/student/dashboard")
        assert restored["selected_itinerary"] == {"id": "first", "title": "Ciències"}
        assert [item["id"] for item in restored["assignments"]] == ["b", "a"]
        assert next(item for item in restored["assignments"] if item["id"] == "a")["best_score"] == 90
        with urllib.request.urlopen(base + "/app.js", timeout=10) as response:
            assert b"data-select-group-itinerary" in response.read()
        docker("exec", portal, "nginx", "-t")
        print("Docker itinerary check: previous-schema migration, teacher/student HTTP flow, ordering, authorization, restart and SQLite restore OK")
    finally:
        for resource in (portal, api):
            subprocess.run(["docker", "rm", "-f", resource], capture_output=True)
        subprocess.run(["docker", "volume", "rm", volume], capture_output=True)
        subprocess.run(["docker", "network", "rm", network], capture_output=True)


if __name__ == "__main__":
    main()
