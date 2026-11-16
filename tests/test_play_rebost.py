"""Play's read-only Rebost bridge and H5P audio export, with a local upstream."""

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
from urllib.parse import parse_qs, urlsplit

import pytest

SOUND_ID = "img-" + "a" * 64
IMAGE_ID = "img-" + "b" * 64
OGG = b"OggS" + b"\x00" * 40
PNG = b"\x89PNG\r\n\x1a\n" + b"\x00" * 20


class RebostUpstream(BaseHTTPRequestHandler):
    requests = []

    def log_message(self, *_args):
        return

    def reply(self, status, body, content_type="application/json"):
        payload = body if isinstance(body, bytes) else json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self):  # noqa: N802
        parsed = urlsplit(self.path)
        query = {key: values[0] for key, values in parse_qs(parsed.query).items()}
        if parsed.path == "/api/assets/v1/items":
            RebostUpstream.requests.append(query)
            sound = query.get("collection") == "effects"
            item = {
                "id": SOUND_ID if sound else IMAGE_ID,
                "name": "Click" if sound else "Sobre",
                "names": {"es": "Click" if sound else "Sobre"},
                "aliases": ["click"],
                "type": "sound" if sound else "object",
                "width": 0 if sound else 100,
                "height": 0 if sound else 70,
                "collection": query.get("collection"),
                "readonly": True,
                "bytes": 44 if sound else 28,
                "license": "CC0-1.0" if sound else "GPL-3.0-only",
                "attribution": "Kenney" if sound else "EduTicTac",
                "revision": 1,
            }
            return self.reply(200, {"items": [item], "next_cursor": item["id"]})
        if parsed.path == f"/api/assets/v1/items/{SOUND_ID}/content":
            return self.reply(200, OGG, "audio/ogg")
        if parsed.path == f"/api/assets/v1/items/{IMAGE_ID}/content":
            return self.reply(200, PNG, "image/png")
        return self.reply(404, {"detail": "missing"})


@pytest.fixture
def servers():
    RebostUpstream.requests = []
    upstream = ThreadingHTTPServer(("127.0.0.1", 18131), RebostUpstream)
    threading.Thread(target=upstream.serve_forever, daemon=True).start()
    data_dir = Path(tempfile.mkdtemp(prefix="edutictac-play-rebost-"))
    process = subprocess.Popen(
        ["python3", "server.py"],
        cwd=Path(__file__).parents[1] / "services" / "play",
        env={
            **os.environ,
            "PORT": "18132",
            "PLAY_DATA_DIR": str(data_dir),
            "PLAY_REBOST_API_URL": "http://127.0.0.1:18131/api/assets/v1",
        },
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    time.sleep(0.3)
    try:
        yield "http://127.0.0.1:18132"
    finally:
        process.terminate()
        process.wait(timeout=3)
        upstream.shutdown()


def get_json(url):
    with urllib.request.urlopen(url) as response:
        return response.status, json.loads(response.read())


def test_public_rebost_catalog_and_content_are_proxied(servers):
    base = servers
    status, config = get_json(base + "/api/config")
    assert status == 200 and config["rebost"] is True
    status, data = get_json(base + "/api/rebost/items?collection=effects&type=sound&q=click&limit=12")
    assert status == 200
    assert data["items"][0]["id"] == SOUND_ID
    assert data["items"][0]["license"] == "CC0-1.0"
    assert data["next_cursor"] == SOUND_ID
    assert RebostUpstream.requests[-1] == {"collection": "effects", "type": "sound", "q": "click", "limit": "12"}
    with urllib.request.urlopen(base + f"/api/rebost/items/{SOUND_ID}/content") as response:
        assert response.status == 200
        assert response.headers["Content-Type"] == "audio/ogg"
        assert response.read() == OGG
    with urllib.request.urlopen(base + f"/api/rebost/items/{IMAGE_ID}/content") as response:
        assert response.headers["Content-Type"] == "image/png"
        assert response.read() == PNG


@pytest.mark.parametrize(
    "query",
    ["collection=mine", "collection=effects&type=object", "collection=catalog&type=sound", "collection=catalog&cursor=bad"],
)
def test_private_or_invalid_filters_are_rejected(servers, query):
    try:
        urllib.request.urlopen(servers + "/api/rebost/items?" + query)
        raise AssertionError("expected an error")
    except urllib.error.HTTPError as error:
        assert error.code == 400


def post_activity(base, payload):
    request = urllib.request.Request(
        base + "/api/activities",
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json", "X-Play-Creator": "test-rebost-audio-01"},
        method="POST",
    )
    with urllib.request.urlopen(request) as response:
        return json.loads(response.read())


def package(content):
    with zipfile.ZipFile(io.BytesIO(content)) as archive:
        return {name: archive.read(name) for name in archive.namelist()}


def test_memory_audio_is_exported_to_h5p(servers):
    base = servers
    audio = "data:audio/ogg;base64," + "T2dnUw=="
    activity = post_activity(base, {
        "type": "memory",
        "title": "Sonidos",
        "question": "Escucha y empareja",
        "cards": [
            {"text": "Click", "audio": audio, "audioCredit": "Kenney · CC0-1.0"},
            {"text": "Metal", "audio": audio, "audioCredit": "Kenney · CC0-1.0"},
        ],
    })
    assert activity["cards"][0]["audio"] == audio
    with urllib.request.urlopen(base + f"/api/activities/{activity['id']}/download") as response:
        files = package(response.read())
    content = json.loads(files["content/content.json"])
    assert content["cards"][0]["audio"] == [{"path": "audio-0.ogg", "mime": "audio/ogg"}]
    assert files["content/audio-0.ogg"] == b"OggS"
    assert b"Kenney" in files["content/CREDITS.txt"]


def test_dialog_cards_audio_is_exported_to_h5p(servers):
    base = servers
    audio = "data:audio/mpeg;base64," + "SUQz"
    activity = post_activity(base, {
        "type": "dialog-cards",
        "title": "Tarjetas",
        "question": "Estudia",
        "cards": [
            {"front": "Uno", "back": "One", "audio": audio},
            {"front": "Dos", "back": "Two"},
            {"front": "Tres", "back": "Three"},
        ],
    })
    with urllib.request.urlopen(base + f"/api/activities/{activity['id']}/download") as response:
        files = package(response.read())
    content = json.loads(files["content/content.json"])
    assert content["dialogs"][0]["audio"] == [{"path": "audio-0.mp3", "mime": "audio/mpeg"}]
    assert files["content/audio-0.mp3"] == b"ID3"


def test_oversized_or_invalid_audio_is_rejected(servers):
    base = servers
    too_big = "data:audio/wav;base64," + "A" * (360 * 1024)
    payload = {
        "type": "memory",
        "title": "Sonidos",
        "question": "Escucha",
        "cards": [
            {"text": "Uno", "audio": too_big},
            {"text": "Dos"},
        ],
    }
    request = urllib.request.Request(
        base + "/api/activities",
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        urllib.request.urlopen(request)
        raise AssertionError("expected 422")
    except urllib.error.HTTPError as error:
        assert error.code == 422
