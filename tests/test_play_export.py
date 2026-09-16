import io
import json
import os
import subprocess
import tempfile
import time
import urllib.request
import zipfile
from pathlib import Path


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
