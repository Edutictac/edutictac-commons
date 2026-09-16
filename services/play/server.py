"""Small, dependency-free EduTicTac Play prototype server."""

from __future__ import annotations

import html
import json
import os
import re
import secrets
import shutil
import tempfile
import zipfile
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).parent
DATA_DIR = Path(os.environ.get("PLAY_DATA_DIR", ROOT / "data"))
ACTIVITIES_DIR = DATA_DIR / "activities"
LIBRARIES_DIR = ROOT / "h5p-libraries"
PUBLIC_DIR = ROOT / "public"
MAX_BODY = 256 * 1024
ID_RE = re.compile(r"^[A-Za-z0-9]{8}$")
PREVIEW_RE = re.compile(r"^preview-[A-Za-z0-9]{8}$")
PREVIEWS: dict[str, dict] = {}
ACTIVITY_ID_PATTERN = r"(?:[A-Za-z0-9]{8}|preview-[A-Za-z0-9]{8})"


def safe_text(value: object, limit: int = 5000) -> str:
    return html.escape(str(value or "").strip()[:limit], quote=True)


def activity_content(activity: dict) -> dict:
    if activity.get("type") == "matching":
        elements = []
        drop_zones = []
        for index, pair in enumerate(activity["pairs"]):
            top = 8 + index * 16
            elements.append({"type": {"library": "H5P.AdvancedText 1.1", "params": {"text": f"<p>{safe_text(pair['left'])}</p>"}}, "x": 5, "y": top, "height": 3, "width": 12, "dropZones": [index], "backgroundOpacity": 100, "multiple": False})
            drop_zones.append({"label": safe_text(pair["right"]), "showLabel": True, "x": 55, "y": top, "height": 3, "width": 18, "correctElements": [index], "backgroundOpacity": 100, "tipsAndFeedback": {"tip": "", "feedbackOnCorrect": "Correcto.", "feedbackOnIncorrect": "Prueba otra vez."}})
        return {
            "scoreShow": "Comprobar", "submit": "Enviar", "tryAgain": "Reintentar",
            "question": {"settings": {"questionTitle": safe_text(activity["question"]), "size": {"width": 620, "height": 310}}, "task": {"elements": elements, "dropZones": drop_zones}},
            "behaviour": {"enableRetry": True, "enableCheckButton": True, "singlePoint": False, "applyPenalties": True, "enableScoreExplanation": True, "dropZoneHighlighting": "dragging", "enableFullScreen": False},
            "overallFeedback": [{"from": 0, "to": 99, "feedback": "Sigue intentándolo."}, {"from": 100, "to": 100, "feedback": "¡Todo correcto!"}],
            "scoreBarLabel": "Has conseguido :num de :total puntos", "a11yCheck": "Comprobar las respuestas.", "a11yRetry": "Reintentar la actividad.",
        }
    if activity.get("type") == "memory":
        return {
            "cards": [
                {"image": {"path": f"card-{index}.svg", "mime": "image/svg+xml", "width": 320, "height": 180}, "imageAlt": safe_text(card["text"])}
                for index, card in enumerate(activity["cards"])
            ],
            "behaviour": {"useGrid": True, "allowRetry": True},
            "l10n": {
                "cardTurns": "Movimientos", "timeSpent": "Tiempo empleado", "feedback": "¡Muy bien!",
                "tryAgain": "Reintentar", "closeLabel": "Cerrar", "label": "Juego de memoria. Encuentra las parejas.",
                "labelInstructions": "Usa las flechas y espacio o enter para girar las cartas.",
                "done": "Has encontrado todas las parejas.", "cardPrefix": "Carta %num de %total:",
                "cardUnturned": "Sin girar. Pulsa para girar.", "cardTurned": "Carta girada.",
                "cardMatched": "Pareja encontrada.", "cardMatchedA11y": "¡Las cartas coinciden!",
                "cardNotMatchedA11y": "No coinciden. Prueba con otras cartas.",
            },
        }
    if activity.get("type") == "true-false":
        return {
            "question": f"<p>{safe_text(activity['question'])}</p>",
            "correct": "true" if activity["correct"] else "false",
            "l10n": {
                "trueText": "Verdadero",
                "falseText": "Falso",
                "score": "Has conseguido @score de @total puntos",
                "checkAnswer": "Comprobar",
                "submitAnswer": "Enviar",
                "showSolutionButton": "Mostrar solución",
                "tryAgain": "Intentarlo de nuevo",
                "wrongAnswerMessage": "Respuesta incorrecta",
                "correctAnswerMessage": "Respuesta correcta",
                "scoreBarLabel": "Has conseguido :num de :total puntos",
                "a11yCheck": "Comprobar la respuesta.",
                "a11yShowSolution": "Mostrar la solución.",
                "a11yRetry": "Reintentar la actividad.",
            },
            "behaviour": {
                "enableRetry": True,
                "enableSolutionsButton": True,
                "enableCheckButton": True,
                "autoCheck": False,
                "confirmCheckDialog": False,
                "confirmRetryDialog": False,
            },
        }
    answers = [
        {
            "text": f"<div>{safe_text(answer['text'])}</div>",
            "correct": bool(answer.get("correct")),
            "tipsAndFeedback": {"tip": "", "chosenFeedback": "", "notChosenFeedback": ""},
        }
        for answer in activity["answers"]
    ]
    return {
        "question": f"<p>{safe_text(activity['question'])}</p>",
        "answers": answers,
        "behaviour": {
            "enableRetry": True,
            "enableSolutionsButton": True,
            "enableCheckButton": True,
            "randomAnswers": True,
            "showSolutionsRequiresInput": True,
            "type": "auto",
            "singlePoint": True,
            "autoCheck": False,
            "passPercentage": 100,
            "showScorePoints": True,
        },
        "UI": {
            "showSolutionButton": "Mostrar solución",
            "tryAgainButton": "Intentarlo de nuevo",
            "checkAnswerButton": "Comprobar",
            "tipsLabel": "Mostrar pista",
            "scoreBarLabel": "Has conseguido :num de :total puntos",
            "tipAvailable": "Hay una pista disponible",
            "feedbackAvailable": "Hay comentarios disponibles",
            "readFeedback": "Leer comentarios",
            "wrongAnswer": "Respuesta incorrecta",
            "correctAnswer": "Respuesta correcta",
            "shouldCheck": "Debía estar marcada",
            "shouldNotCheck": "No debía estar marcada",
            "noInput": "Responde antes de ver la solución",
            "submitAnswerButton": "Enviar respuesta",
            "a11yCheck": "Comprobar las respuestas.",
            "a11yShowSolution": "Mostrar la solución.",
            "a11yRetry": "Reintentar la actividad.",
        },
        "overallFeedback": [
            {"from": 0, "to": 99, "feedback": "Sigue intentándolo."},
            {"from": 100, "to": 100, "feedback": "¡Correcto!"},
        ],
        "confirmCheck": {"header": "¿Terminar?", "body": "¿Quieres comprobar la respuesta?", "cancelLabel": "Cancelar", "confirmLabel": "Comprobar"},
        "confirmRetry": {"header": "¿Reintentar?", "body": "Se borrarán tus respuestas.", "cancelLabel": "Cancelar", "confirmLabel": "Reintentar"},
    }


def package_files(activity: dict) -> dict[str, bytes]:
    if activity.get("type") == "matching":
        main_library = "H5P.DragQuestion"
        dependencies = [
            {"machineName": "H5P.DragQuestion", "majorVersion": 1, "minorVersion": 15},
            {"machineName": "jQuery.ui", "majorVersion": 1, "minorVersion": 10},
            {"machineName": "H5P.AdvancedText", "majorVersion": 1, "minorVersion": 1},
            {"machineName": "H5P.Components", "majorVersion": 1, "minorVersion": 0},
            {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
            {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
            {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
        ]
        is_true_false = False
    elif activity.get("type") == "memory":
        main_library = "H5P.MemoryGame"
        dependencies = [
            {"machineName": "H5P.MemoryGame", "majorVersion": 1, "minorVersion": 3},
            {"machineName": "H5P.Timer", "majorVersion": 0, "minorVersion": 4},
            {"machineName": "H5P.Components", "majorVersion": 1, "minorVersion": 0},
            {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
        ]
        is_true_false = False
    else:
        is_true_false = activity.get("type") == "true-false"
    if activity.get("type") not in {"memory", "matching"}:
        main_library = "H5P.TrueFalse" if is_true_false else "H5P.MultiChoice"
        dependencies = [
            {"machineName": "H5P.TrueFalse", "majorVersion": 1, "minorVersion": 8},
            {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
            {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
            {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
            {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
        ] if is_true_false else [
            {"machineName": "H5P.MultiChoice", "majorVersion": 1, "minorVersion": 16},
            {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
            {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
            {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
            {"machineName": "H5P.Transition", "majorVersion": 1, "minorVersion": 0},
            {"machineName": "H5P.FontIcons", "majorVersion": 1, "minorVersion": 0},
        ]
    h5p = {
        "title": activity["title"],
        "language": activity.get("language", "es"),
        "mainLibrary": main_library,
        "embedTypes": ["div"],
        "license": "CC BY-SA",
        "licenseVersion": "4.0",
        "preloadedDependencies": dependencies,
    }
    files = {
        "h5p.json": json.dumps(h5p, ensure_ascii=False, indent=2).encode(),
        "content/content.json": json.dumps(activity_content(activity), ensure_ascii=False, indent=2).encode(),
    }
    if activity.get("type") == "memory":
        for index, card in enumerate(activity["cards"]):
            text = safe_text(card["text"], 120)
            files[f"content/card-{index}.svg"] = (
                f'<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180">'
                f'<rect width="320" height="180" rx="18" fill="#176b5c"/>'
                f'<text x="160" y="100" fill="white" font-family="sans-serif" font-size="24" text-anchor="middle">{text}</text></svg>'
            ).encode()
    for path in LIBRARIES_DIR.rglob("*"):
        if path.is_file():
            files[str(path.relative_to(LIBRARIES_DIR))] = path.read_bytes()
    return files


def validate_activity(payload: dict) -> tuple[dict | None, list[str]]:
    errors = []
    activity_type = str(payload.get("type", "multiple-choice"))
    title = str(payload.get("title", "")).strip()
    question = str(payload.get("question", "")).strip()
    if activity_type == "true-false":
        correct = payload.get("correct")
        if not isinstance(correct, bool):
            errors.append("Elige si la afirmación es verdadera o falsa.")
        if errors:
            return None, errors
        return {"type": activity_type, "title": title[:200], "question": question[:2000], "correct": correct, "language": "es"}, []
    if activity_type == "memory":
        cards = payload.get("cards")
        if not title:
            errors.append("Escribe un título.")
        if not question:
            errors.append("Escribe una descripción.")
        if not isinstance(cards, list) or not 2 <= len(cards) <= 12:
            errors.append("Añade entre 2 y 12 parejas.")
            cards = []
        cleaned = [{"text": str(card.get("text", "")).strip()[:120]} for card in cards if isinstance(card, dict) and str(card.get("text", "")).strip()]
        if len(cleaned) != len(cards):
            errors.append("Cada pareja debe tener texto.")
        if errors:
            return None, errors
        return {"type": activity_type, "title": title[:200], "question": question[:2000], "cards": cleaned, "language": "es"}, []
    if activity_type == "matching":
        pairs = payload.get("pairs")
        if not title:
            errors.append("Escribe un título.")
        if not question:
            errors.append("Escribe una descripción.")
        if not isinstance(pairs, list) or not 2 <= len(pairs) <= 8:
            errors.append("Añade entre 2 y 8 parejas.")
            pairs = []
        cleaned = [{"left": str(pair.get("left", "")).strip()[:120], "right": str(pair.get("right", "")).strip()[:120]} for pair in pairs if isinstance(pair, dict) and str(pair.get("left", "")).strip() and str(pair.get("right", "")).strip()]
        if len(cleaned) != len(pairs):
            errors.append("Cada relación debe tener dos textos.")
        if errors:
            return None, errors
        return {"type": activity_type, "title": title[:200], "question": question[:2000], "pairs": cleaned, "language": "es"}, []
    if activity_type != "multiple-choice":
        errors.append("Tipo de actividad no disponible.")
        return None, errors
    answers = payload.get("answers")
    if not title:
        errors.append("Escribe un título.")
    if not question:
        errors.append("Escribe una pregunta.")
    if not isinstance(answers, list) or not 2 <= len(answers) <= 8:
        errors.append("Añade entre 2 y 8 respuestas.")
        answers = []
    cleaned = []
    for answer in answers:
        text = str(answer.get("text", "")).strip() if isinstance(answer, dict) else ""
        if text:
            cleaned.append({"text": text[:500], "correct": bool(answer.get("correct"))})
    if len(cleaned) != len(answers):
        errors.append("Cada respuesta debe tener texto.")
    if not any(answer["correct"] for answer in cleaned):
        errors.append("Marca al menos una respuesta correcta.")
    if errors:
        return None, errors
    return {"type": activity_type, "title": title[:200], "question": question[:2000], "answers": cleaned, "language": "es"}, []


class Handler(BaseHTTPRequestHandler):
    server_version = "EduTicTacPlay/0.1"

    def send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802
        path = unquote(urlparse(self.path).path)
        if path == "/api/health":
            self.send_json(HTTPStatus.OK, {"status": "ok", "service": "edutictac-play"})
            return
        match = re.fullmatch(rf"/api/activities/({ACTIVITY_ID_PATTERN})", path)
        if match:
            activity = read_activity(match.group(1))
            if activity:
                self.send_json(HTTPStatus.OK, activity)
            else:
                self.send_json(HTTPStatus.NOT_FOUND, {"error": "Actividad no encontrada."})
            return
        match = re.fullmatch(rf"/api/activities/({ACTIVITY_ID_PATTERN})/download", path)
        if match:
            activity = read_activity(match.group(1))
            if not activity:
                self.send_json(HTTPStatus.NOT_FOUND, {"error": "Actividad no encontrada."})
                return
            self.download_package(activity)
            return
        match = re.fullmatch(rf"/api/activities/({ACTIVITY_ID_PATTERN})/h5p/(h5p\.json|content/content\.json)", path)
        if match:
            activity = read_activity(match.group(1))
            if not activity:
                self.send_error(HTTPStatus.NOT_FOUND)
                return
            files = package_files(activity)
            body = files[match.group(2)]
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if path.startswith("/h5p-libraries/"):
            relative = path.removeprefix("/h5p-libraries/")
            candidate = (LIBRARIES_DIR / relative).resolve()
            if LIBRARIES_DIR not in candidate.parents or not candidate.is_file():
                self.send_error(HTTPStatus.NOT_FOUND)
                return
            body = candidate.read_bytes()
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", content_type_for(candidate))
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        self.serve_static(path)

    def do_POST(self) -> None:  # noqa: N802
        route = urlparse(self.path).path
        if route not in {"/api/activities", "/api/previews"}:
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "Ruta no encontrada."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > MAX_BODY:
                raise ValueError("El contenido es demasiado grande.")
            payload = json.loads(self.rfile.read(length))
        except (ValueError, json.JSONDecodeError):
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": "Datos no válidos."})
            return
        activity, errors = validate_activity(payload)
        if errors:
            self.send_json(HTTPStatus.UNPROCESSABLE_ENTITY, {"errors": errors})
            return
        if route == "/api/previews":
            activity["id"] = f"preview-{new_id()}"
            PREVIEWS[activity["id"]] = activity
            self.send_json(HTTPStatus.CREATED, activity)
            return
        activity["id"] = new_id()
        activity["visibility"] = "public"
        activity["createdAt"] = __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat()
        save_activity(activity)
        self.send_json(HTTPStatus.CREATED, activity)

    def download_package(self, activity: dict) -> None:
        with tempfile.NamedTemporaryFile(suffix=".h5p") as tmp:
            with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as archive:
                for name, content in package_files(activity).items():
                    archive.writestr(name, content)
            tmp.flush()
            body = Path(tmp.name).read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "application/zip")
        self.send_header("Content-Disposition", f'attachment; filename="{activity["id"]}.h5p"')
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def serve_static(self, path: str) -> None:
        play_match = re.fullmatch(r"/play/([A-Za-z0-9]{8})", path)
        if play_match and read_activity(play_match.group(1)):
            path = "/index.html"
        if path == "/":
            path = "/index.html"
        candidate = (PUBLIC_DIR / path.lstrip("/")).resolve()
        if PUBLIC_DIR not in candidate.parents or not candidate.is_file():
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        content_type = {".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json"}.get(candidate.suffix, "application/octet-stream")
        body = candidate.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self) -> None:
        self.send_header("Content-Security-Policy", "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; frame-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'self'")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        super().end_headers()


def content_type_for(path: Path) -> str:
    return {
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".svg": "image/svg+xml",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".ttf": "font/ttf",
        ".eot": "application/vnd.ms-fontobject",
    }.get(path.suffix, "application/octet-stream")


def new_id() -> str:
    while True:
        value = secrets.token_hex(4)
        if not (ACTIVITIES_DIR / value / "activity.json").exists():
            return value


def save_activity(activity: dict) -> None:
    folder = ACTIVITIES_DIR / activity["id"]
    folder.mkdir(parents=True, exist_ok=False)
    (folder / "activity.json").write_text(json.dumps(activity, ensure_ascii=False, indent=2), encoding="utf-8")


def read_activity(activity_id: str) -> dict | None:
    if PREVIEW_RE.fullmatch(activity_id):
        return PREVIEWS.get(activity_id)
    if not ID_RE.fullmatch(activity_id):
        return None
    file = ACTIVITIES_DIR / activity_id / "activity.json"
    try:
        return json.loads(file.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def main() -> None:
    ACTIVITIES_DIR.mkdir(parents=True, exist_ok=True)
    port = int(os.environ.get("PORT", "8083"))
    ThreadingHTTPServer(("0.0.0.0", port), Handler).serve_forever()


if __name__ == "__main__":
    main()
