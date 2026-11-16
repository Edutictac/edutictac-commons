"""HTTP caching for Play's immutable H5P libraries and revalidated shell assets."""

import os
import subprocess
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

import pytest


@pytest.fixture(scope="module")
def play():
    process = subprocess.Popen(
        ["python3", "server.py"],
        cwd=Path(__file__).parents[1] / "services" / "play",
        env={**os.environ, "PORT": "18133", "PLAY_DATA_DIR": tempfile.mkdtemp(prefix="edutictac-play-cache-")},
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    time.sleep(0.3)
    try:
        yield "http://127.0.0.1:18133"
    finally:
        process.terminate()
        process.wait(timeout=3)


def headers(url, extra=None):
    request = urllib.request.Request(url, headers=extra or {})
    with urllib.request.urlopen(request) as response:
        return response.status, dict(response.headers)


def test_h5p_libraries_are_immutable_and_revalidate(play):
    url = play + "/h5p-libraries/H5P.Question-1.5/scripts/question.js"
    status, first = headers(url)
    assert status == 200
    assert "max-age=31536000" in first["Cache-Control"]
    assert "immutable" in first["Cache-Control"]
    with pytest.raises(urllib.error.HTTPError) as error:
        headers(url, {"If-None-Match": first["ETag"]})
    assert error.value.code == 304


def test_shell_assets_are_revalidated_not_stored_forever(play):
    url = play + "/assets/main.bundle.js"
    status, first = headers(url)
    assert status == 200
    assert first["Cache-Control"] == "no-cache"
    with pytest.raises(urllib.error.HTTPError) as error:
        headers(url, {"If-None-Match": 'W/' + first["ETag"]})
    assert error.value.code == 304
