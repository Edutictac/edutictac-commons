import io
import json
import os
import subprocess
import tempfile
import threading
import time
import urllib.error
import urllib.request
import zipfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import pytest


class CommonsScoreHandler(BaseHTTPRequestHandler):
    received = None

    def do_POST(self):  # noqa: N802
        length = int(self.headers.get("Content-Length", "0"))
        CommonsScoreHandler.received = {
            "body": json.loads(self.rfile.read(length)),
            "cookie": self.headers.get("Cookie", ""),
        }
        body = json.dumps({"ok": True, "id": "score-1", "score": 80}).encode()
        self.send_response(201)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *_args):
        return


def test_multiple_choice_h5p_export():
    data_dir = Path(tempfile.mkdtemp(prefix="edutictac-play-test-"))
    process = subprocess.Popen(
        ["python3", "server.py"],
        cwd=Path(__file__).parents[1] / "services" / "play",
        env={**os.environ, "PORT": "18099", "PLAY_DATA_DIR": str(data_dir)},
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        time.sleep(0.25)
        payload = json.dumps(
            {
                "title": "Animales",
                "question": "¿Cuál vuela?",
                "answers": [
                    {"text": "Águila", "correct": True},
                    {"text": "Gato", "correct": False},
                ],
            }
        ).encode()
        request = urllib.request.Request(
            "http://127.0.0.1:18099/api/activities",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        activity = json.loads(urllib.request.urlopen(request).read())
        package = urllib.request.urlopen(
            f"http://127.0.0.1:18099/api/activities/{activity['id']}/download"
        ).read()
        with zipfile.ZipFile(io.BytesIO(package)) as archive:
            names = set(archive.namelist())
            assert {"h5p.json", "content/content.json", "H5P.MultiChoice-1.16/library.json"} <= names
            assert json.loads(archive.read("h5p.json"))["mainLibrary"] == "H5P.MultiChoice"
            content = json.loads(archive.read("content/content.json"))
            assert content["answers"][0]["correct"] is True
    finally:
        process.terminate()
        process.wait(timeout=3)


def test_activity_keeps_catalogue_metadata():
    data_dir = Path(tempfile.mkdtemp(prefix="edutictac-play-test-"))
    process = subprocess.Popen(
        ["python3", "server.py"],
        cwd=Path(__file__).parents[1] / "services" / "play",
        env={**os.environ, "PORT": "18105", "PLAY_DATA_DIR": str(data_dir)},
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        time.sleep(0.25)
        payload = json.dumps({
            "title": "Animales",
            "question": "¿Cuál vuela?",
            "answers": [{"text": "Águila", "correct": True}, {"text": "Gato", "correct": False}],
            "description": "Una actividad de ciencias.",
            "subject": "Ciencias",
            "educational_stage": "Primaria",
            "tags": ["ciencias", "ciencias"],
            "license": "CC0",
            "author_pseudonym": "Aula 1",
        }).encode()
        request = urllib.request.Request("http://127.0.0.1:18105/api/activities", data=payload, headers={"Content-Type": "application/json"}, method="POST")
        activity = json.loads(urllib.request.urlopen(request).read())
        assert activity["description"] == "Una actividad de ciencias."
        assert activity["subject"] == "Ciencias"
        assert activity["educational_stage"] == "Primaria"
        assert activity["tags"] == ["ciencias"]
        assert activity["license"] == "CC0"
        assert activity["author_pseudonym"] == "Aula 1"
    finally:
        process.terminate()
        process.wait(timeout=3)


def test_true_false_h5p_export():
    data_dir = Path(tempfile.mkdtemp(prefix="edutictac-play-test-"))
    process = subprocess.Popen(
        ["python3", "server.py"],
        cwd=Path(__file__).parents[1] / "services" / "play",
        env={**os.environ, "PORT": "18100", "PLAY_DATA_DIR": str(data_dir)},
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        time.sleep(0.25)
        payload = json.dumps({"type": "true-false", "title": "Ciencia", "question": "El agua se congela a 0 °C.", "correct": True}).encode()
        request = urllib.request.Request("http://127.0.0.1:18100/api/activities", data=payload, headers={"Content-Type": "application/json"}, method="POST")
        activity = json.loads(urllib.request.urlopen(request).read())
        package = urllib.request.urlopen(f"http://127.0.0.1:18100/api/activities/{activity['id']}/download").read()
        with zipfile.ZipFile(io.BytesIO(package)) as archive:
            names = set(archive.namelist())
            assert {"h5p.json", "content/content.json", "H5P.TrueFalse-1.8/library.json"} <= names
            assert json.loads(archive.read("h5p.json"))["mainLibrary"] == "H5P.TrueFalse"
            assert json.loads(archive.read("content/content.json"))["correct"] == "true"
    finally:
        process.terminate()
        process.wait(timeout=3)


def test_memory_h5p_export():
    data_dir = Path(tempfile.mkdtemp(prefix="edutictac-play-test-"))
    process = subprocess.Popen(
        ["python3", "server.py"],
        cwd=Path(__file__).parents[1] / "services" / "play",
        env={**os.environ, "PORT": "18101", "PLAY_DATA_DIR": str(data_dir)},
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        time.sleep(0.25)
        payload = json.dumps({"type": "memory", "title": "Animales", "question": "Encuentra las parejas", "cards": [{"text": "Gato"}, {"text": "Perro"}]}).encode()
        request = urllib.request.Request("http://127.0.0.1:18101/api/activities", data=payload, headers={"Content-Type": "application/json"}, method="POST")
        activity = json.loads(urllib.request.urlopen(request).read())
        package = urllib.request.urlopen(f"http://127.0.0.1:18101/api/activities/{activity['id']}/download").read()
        with zipfile.ZipFile(io.BytesIO(package)) as archive:
            names = set(archive.namelist())
            assert {"h5p.json", "content/content.json", "content/card-0.svg", "H5P.MemoryGame-1.3/library.json"} <= names
            assert json.loads(archive.read("h5p.json"))["mainLibrary"] == "H5P.MemoryGame"
            assert json.loads(archive.read("content/content.json"))["cards"][0]["image"]["path"] == "card-0.svg"
    finally:
        process.terminate()
        process.wait(timeout=3)


def test_matching_h5p_export():
    data_dir = Path(tempfile.mkdtemp(prefix="edutictac-play-test-"))
    process = subprocess.Popen(
        ["python3", "server.py"],
        cwd=Path(__file__).parents[1] / "services" / "play",
        env={**os.environ, "PORT": "18102", "PLAY_DATA_DIR": str(data_dir)},
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        time.sleep(0.25)
        payload = json.dumps({"type": "matching", "title": "Capitales", "question": "Relaciona cada país con su capital", "pairs": [{"left": "España", "right": "Madrid"}, {"left": "Italia", "right": "Roma"}]}).encode()
        request = urllib.request.Request("http://127.0.0.1:18102/api/activities", data=payload, headers={"Content-Type": "application/json"}, method="POST")
        activity = json.loads(urllib.request.urlopen(request).read())
        package = urllib.request.urlopen(f"http://127.0.0.1:18102/api/activities/{activity['id']}/download").read()
        with zipfile.ZipFile(io.BytesIO(package)) as archive:
            names = set(archive.namelist())
            assert {"h5p.json", "content/content.json", "H5P.DragQuestion-1.15/library.json", "jQuery.ui-1.10/library.json"} <= names
            assert json.loads(archive.read("h5p.json"))["mainLibrary"] == "H5P.DragQuestion"
            content = json.loads(archive.read("content/content.json"))
            assert content["question"]["task"]["dropZones"][0]["correctElements"] == [0]
    finally:
        process.terminate()
        process.wait(timeout=3)


def test_classify_h5p_export():
    data_dir = Path(tempfile.mkdtemp(prefix="edutictac-play-test-"))
    process = subprocess.Popen(
        ["python3", "server.py"],
        cwd=Path(__file__).parents[1] / "services" / "play",
        env={**os.environ, "PORT": "18106", "PLAY_DATA_DIR": str(data_dir)},
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        time.sleep(0.25)
        payload = json.dumps({"type": "classify", "title": "Animales", "question": "Clasifica los elementos", "categories": [{"name": "Vivos"}, {"name": "No vivos"}], "items": [{"text": "Roble", "category": 0}, {"text": "Piedra", "category": 1}, {"text": "Gato", "category": 0}]}).encode()
        request = urllib.request.Request("http://127.0.0.1:18106/api/activities", data=payload, headers={"Content-Type": "application/json"}, method="POST")
        activity = json.loads(urllib.request.urlopen(request).read())
        package = urllib.request.urlopen(f"http://127.0.0.1:18106/api/activities/{activity['id']}/download").read()
        with zipfile.ZipFile(io.BytesIO(package)) as archive:
            names = set(archive.namelist())
            assert {"h5p.json", "content/content.json", "H5P.DragQuestion-1.15/library.json"} <= names
            content = json.loads(archive.read("content/content.json"))
            assert content["question"]["task"]["dropZones"][0]["correctElements"] == [0, 2]
            assert content["question"]["task"]["elements"][1]["dropZones"] == [1]
    finally:
        process.terminate()
        process.wait(timeout=3)


def test_ordering_h5p_export():
    data_dir = Path(tempfile.mkdtemp(prefix="edutictac-play-test-"))
    process = subprocess.Popen(["python3", "server.py"], cwd=Path(__file__).parents[1] / "services" / "play", env={**os.environ, "PORT": "18107", "PLAY_DATA_DIR": str(data_dir)}, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        time.sleep(0.25)
        payload = json.dumps({"type": "ordering", "title": "Ciclo", "question": "Ordena el proceso", "categories": [{"name": "1"}, {"name": "2"}, {"name": "3"}], "items": [{"text": "Nace", "category": 0}, {"text": "Crece", "category": 1}, {"text": "Se reproduce", "category": 2}]}).encode()
        request = urllib.request.Request("http://127.0.0.1:18107/api/activities", data=payload, headers={"Content-Type": "application/json"}, method="POST")
        activity = json.loads(urllib.request.urlopen(request).read())
        package = urllib.request.urlopen(f"http://127.0.0.1:18107/api/activities/{activity['id']}/download").read()
        with zipfile.ZipFile(io.BytesIO(package)) as archive:
            content = json.loads(archive.read("content/content.json"))
            assert json.loads(archive.read("h5p.json"))["mainLibrary"] == "H5P.DragQuestion"
            assert [zone["correctElements"] for zone in content["question"]["task"]["dropZones"]] == [[0], [1], [2]]
    finally:
        process.terminate()
        process.wait(timeout=3)


def test_fill_blanks_h5p_export():
    data_dir = Path(tempfile.mkdtemp(prefix="edutictac-play-test-"))
    process = subprocess.Popen(["python3", "server.py"], cwd=Path(__file__).parents[1] / "services" / "play", env={**os.environ, "PORT": "18108", "PLAY_DATA_DIR": str(data_dir)}, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        time.sleep(0.25)
        payload = json.dumps({"type": "fill-blanks", "title": "Ciencia", "question": "Completa la frase", "text": "El agua hierve a *100* grados."}).encode()
        request = urllib.request.Request("http://127.0.0.1:18108/api/activities", data=payload, headers={"Content-Type": "application/json"}, method="POST")
        activity = json.loads(urllib.request.urlopen(request).read())
        package = urllib.request.urlopen(f"http://127.0.0.1:18108/api/activities/{activity['id']}/download").read()
        with zipfile.ZipFile(io.BytesIO(package)) as archive:
            names = set(archive.namelist())
            assert {"h5p.json", "content/content.json", "H5P.Blanks-1.14/library.json", "H5P.TextUtilities-1.3/library.json"} <= names
            assert json.loads(archive.read("h5p.json"))["mainLibrary"] == "H5P.Blanks"
            assert "*100*" in json.loads(archive.read("content/content.json"))["questions"][0]
    finally:
        process.terminate()
        process.wait(timeout=3)


def test_find_words_h5p_export():
    data_dir = Path(tempfile.mkdtemp(prefix="edutictac-play-test-"))
    process = subprocess.Popen(["python3", "server.py"], cwd=Path(__file__).parents[1] / "services" / "play", env={**os.environ, "PORT": "18109", "PLAY_DATA_DIR": str(data_dir)}, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        time.sleep(0.25)
        payload = json.dumps({"type": "find-words", "title": "Naturaleza", "question": "Encuentra las palabras", "words": ["agua", "tierra", "planta", "animal"]}).encode()
        request = urllib.request.Request("http://127.0.0.1:18109/api/activities", data=payload, headers={"Content-Type": "application/json"}, method="POST")
        activity = json.loads(urllib.request.urlopen(request).read())
        package = urllib.request.urlopen(f"http://127.0.0.1:18109/api/activities/{activity['id']}/download").read()
        with zipfile.ZipFile(io.BytesIO(package)) as archive:
            names = set(archive.namelist())
            assert {"h5p.json", "content/content.json", "H5P.FindTheWords-1.4/library.json", "H5P.Timer-0.4/library.json"} <= names
            assert json.loads(archive.read("h5p.json"))["mainLibrary"] == "H5P.FindTheWords"
            content = json.loads(archive.read("content/content.json"))
            assert content["wordList"] == "agua,tierra,planta,animal"
    finally:
        process.terminate()
        process.wait(timeout=3)


def test_drag_text_h5p_export():
    data_dir = Path(tempfile.mkdtemp(prefix="edutictac-play-test-"))
    process = subprocess.Popen(["python3", "server.py"], cwd=Path(__file__).parents[1] / "services" / "play", env={**os.environ, "PORT": "18111", "PLAY_DATA_DIR": str(data_dir)}, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        time.sleep(0.25)
        payload = json.dumps({"type": "drag-text", "title": "Planetas", "question": "Completa la frase", "text": "La Tierra gira alrededor del *Sol*."}).encode()
        request = urllib.request.Request("http://127.0.0.1:18111/api/activities", data=payload, headers={"Content-Type": "application/json"}, method="POST")
        activity = json.loads(urllib.request.urlopen(request).read())
        package = urllib.request.urlopen(f"http://127.0.0.1:18111/api/activities/{activity['id']}/download").read()
        with zipfile.ZipFile(io.BytesIO(package)) as archive:
            names = set(archive.namelist())
            assert {"h5p.json", "content/content.json", "H5P.DragText-1.10/library.json", "H5P.Components-1.0/library.json"} <= names
            assert json.loads(archive.read("h5p.json"))["mainLibrary"] == "H5P.DragText"
            assert "*Sol*" in json.loads(archive.read("content/content.json"))["textField"]
    finally:
        process.terminate()
        process.wait(timeout=3)


def test_mark_words_h5p_export():
    data_dir = Path(tempfile.mkdtemp(prefix="edutictac-play-test-"))
    process = subprocess.Popen(["python3", "server.py"], cwd=Path(__file__).parents[1] / "services" / "play", env={**os.environ, "PORT": "18112", "PLAY_DATA_DIR": str(data_dir)}, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        time.sleep(0.25)
        payload = json.dumps({"type": "mark-words", "title": "Gramática", "question": "Señala los adjetivos", "text": "El *rápido* guepardo cruzó la *seca* llanura."}).encode()
        request = urllib.request.Request("http://127.0.0.1:18112/api/activities", data=payload, headers={"Content-Type": "application/json"}, method="POST")
        activity = json.loads(urllib.request.urlopen(request).read())
        package = urllib.request.urlopen(f"http://127.0.0.1:18112/api/activities/{activity['id']}/download").read()
        with zipfile.ZipFile(io.BytesIO(package)) as archive:
            names = set(archive.namelist())
            assert {"h5p.json", "content/content.json", "H5P.MarkTheWords-1.11/library.json"} <= names
            assert json.loads(archive.read("h5p.json"))["mainLibrary"] == "H5P.MarkTheWords"
            assert "*rápido*" in json.loads(archive.read("content/content.json"))["textField"]
    finally:
        process.terminate()
        process.wait(timeout=3)


def test_memory_card_image_is_served_for_player():
    data_dir = Path(tempfile.mkdtemp(prefix="edutictac-play-test-"))
    process = subprocess.Popen(
        ["python3", "server.py"],
        cwd=Path(__file__).parents[1] / "services" / "play",
        env={**os.environ, "PORT": "18104", "PLAY_DATA_DIR": str(data_dir)},
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        time.sleep(0.25)
        payload = json.dumps({"type": "memory", "title": "Animales", "question": "Encuentra las parejas", "cards": [{"text": "Gato"}, {"text": "Perro"}]}).encode()
        request = urllib.request.Request("http://127.0.0.1:18104/api/activities", data=payload, headers={"Content-Type": "application/json"}, method="POST")
        activity = json.loads(urllib.request.urlopen(request).read())
        with urllib.request.urlopen(f"http://127.0.0.1:18104/api/activities/{activity['id']}/h5p/content/card-0.svg") as response:
            assert response.status == 200
            assert response.headers["Content-Type"].startswith("image/svg+xml")
            assert "Gato" in response.read().decode()
    finally:
        process.terminate()
        process.wait(timeout=3)


def test_commons_score_proxy_forwards_identity_cookie():
    CommonsScoreHandler.received = None
    upstream = ThreadingHTTPServer(("127.0.0.1", 0), CommonsScoreHandler)
    thread = threading.Thread(target=upstream.serve_forever, daemon=True)
    thread.start()
    data_dir = Path(tempfile.mkdtemp(prefix="edutictac-play-test-"))
    process = subprocess.Popen(
        ["python3", "server.py"],
        cwd=Path(__file__).parents[1] / "services" / "play",
        env={
            **os.environ,
            "PORT": "18103",
            "PLAY_DATA_DIR": str(data_dir),
            "EDUTICTAC_ID_API_URL": f"http://127.0.0.1:{upstream.server_port}",
            "EDUTICTAC_PLAY_APP_ID": "edutictac-play",
        },
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        time.sleep(0.25)
        payload = json.dumps({
            "activity_id": "Ab12Cd34",
            "assignment_id": "assignment-1",
            "result_id": "https://example.test/results/1",
            "score": 80,
            "metadata": {"source": "h5p-xapi", "raw_score": 4, "max_score": 5},
        }).encode()
        request = urllib.request.Request(
            "http://127.0.0.1:18103/api/commons/score",
            data=payload,
            headers={"Content-Type": "application/json", "Cookie": "edutictac_id=session"},
            method="POST",
        )
        response = urllib.request.urlopen(request)
        assert response.status == 201
        assert CommonsScoreHandler.received == {
            "body": {
                "app_id": "edutictac-play",
                "activity_id": "Ab12Cd34",
                "assignment_id": "assignment-1",
                "result_id": "https://example.test/results/1",
                "score": 80,
                "metadata": {"source": "h5p-xapi", "raw_score": 4, "max_score": 5},
            },
            "cookie": "edutictac_id=session",
        }
    finally:
        process.terminate()
        process.wait(timeout=3)
        upstream.shutdown()
        upstream.server_close()


def _create_activity(port: int, title: str) -> dict:
    payload = json.dumps({
        "type": "multiple-choice",
        "title": title,
        "question": "¿Pregunta?",
        "answers": [{"text": "Correcta", "correct": True}, {"text": "Incorrecta", "correct": False}],
    }).encode()
    request = urllib.request.Request(f"http://127.0.0.1:{port}/api/activities", data=payload, headers={"Content-Type": "application/json"}, method="POST")
    return json.loads(urllib.request.urlopen(request).read())


def test_list_activities_is_paginated():
    data_dir = Path(tempfile.mkdtemp(prefix="edutictac-play-test-"))
    process = subprocess.Popen(
        ["python3", "server.py"],
        cwd=Path(__file__).parents[1] / "services" / "play",
        env={**os.environ, "PORT": "18105", "PLAY_DATA_DIR": str(data_dir)},
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        time.sleep(0.25)
        for index in range(3):
            _create_activity(18105, f"Actividad {index}")
        page = json.loads(urllib.request.urlopen("http://127.0.0.1:18105/api/activities?limit=2").read())
        assert page["total"] == 3
        assert len(page["items"]) == 2
        assert page["hasMore"] is True
        assert {"id", "type", "title", "language", "createdAt"} <= set(page["items"][0])
        second = json.loads(urllib.request.urlopen("http://127.0.0.1:18105/api/activities?limit=2&offset=2").read())
        assert len(second["items"]) == 1
        assert second["hasMore"] is False
        filtered = json.loads(urllib.request.urlopen("http://127.0.0.1:18105/api/activities?type=true-false").read())
        assert filtered["total"] == 0
    finally:
        process.terminate()
        process.wait(timeout=3)


def test_delete_activity_requires_admin_token():
    data_dir = Path(tempfile.mkdtemp(prefix="edutictac-play-test-"))
    process = subprocess.Popen(
        ["python3", "server.py"],
        cwd=Path(__file__).parents[1] / "services" / "play",
        env={**os.environ, "PORT": "18106", "PLAY_DATA_DIR": str(data_dir), "EDUTICTAC_PLAY_ADMIN_TOKEN": "secret-token"},
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        time.sleep(0.25)
        activity = _create_activity(18106, "Para borrar")
        url = f"http://127.0.0.1:18106/api/activities/{activity['id']}"
        with pytest.raises(urllib.error.HTTPError) as forbidden:
            urllib.request.urlopen(urllib.request.Request(url, method="DELETE"))
        assert forbidden.value.code == 403
        delete = urllib.request.Request(url, method="DELETE", headers={"X-Admin-Token": "secret-token"})
        assert json.loads(urllib.request.urlopen(delete).read())["deleted"] == activity["id"]
        with pytest.raises(urllib.error.HTTPError) as missing:
            urllib.request.urlopen(url)
        assert missing.value.code == 404
    finally:
        process.terminate()
        process.wait(timeout=3)
