"""Small, dependency-free EduTicTac Play prototype server."""

from __future__ import annotations

import html
import json
import os
import re
import secrets
import shutil
import tempfile
import time
import zipfile
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, unquote, urlparse
from urllib.request import Request as UpstreamRequest, urlopen

from recursos import RecursosContractError, build_publish_payload


ROOT = Path(__file__).parent
DATA_DIR = Path(os.environ.get("PLAY_DATA_DIR", ROOT / "data"))
ACTIVITIES_DIR = DATA_DIR / "activities"
LIBRARIES_DIR = ROOT / "h5p-libraries"
PUBLIC_DIR = ROOT / "public"
MAX_BODY = 256 * 1024
HOST = os.environ.get("HOST", "0.0.0.0")
URL_PREFIX = os.environ.get("URL_PREFIX", "").rstrip("/")
COMMONS_API_URL = os.environ.get("EDUTICTAC_ID_API_URL", "").rstrip("/")
COMMONS_APP_ID = os.environ.get("EDUTICTAC_PLAY_APP_ID", "edutictac-play")
COMMONS_APP_TOKEN = os.environ.get("EDUTICTAC_ID_APP_TOKEN", "")
PLAY_ADMIN_TOKEN = os.environ.get("EDUTICTAC_PLAY_ADMIN_TOKEN", "").strip()
RECURSOS_API_URL = os.environ.get("RECURSOS_API_URL", "").rstrip("/")
RECURSOS_INGEST_TOKEN = os.environ.get("PLAY_INGEST_TOKEN", "").strip()
PLAY_PUBLIC_URL = os.environ.get("PLAY_PUBLIC_URL", "").rstrip("/")
ID_RE = re.compile(r"^[A-Za-z0-9]{8}$")
PREVIEW_RE = re.compile(r"^preview-[A-Za-z0-9]{8}$")
PREVIEWS: dict[str, dict] = {}
LAUNCH_CONTEXTS: dict[str, dict] = {}
ACTIVITY_ID_PATTERN = r"(?:[A-Za-z0-9]{8}|preview-[A-Za-z0-9]{8})"


def safe_text(value: object, limit: int = 5000) -> str:
    return html.escape(str(value or "").strip()[:limit], quote=True)


LANGUAGES = ("es", "ca", "en")

H5P_TEXT: dict[str, dict[str, str]] = {
    "es": {
        "check": "Comprobar",
        "submit": "Enviar",
        "retryShort": "Reintentar",
        "retryLong": "Intentarlo de nuevo",
        "showSolution": "Mostrar solución",
        "correct": "Correcto.",
        "incorrect": "Prueba otra vez.",
        "tryHarder": "Sigue intentándolo.",
        "allCorrect": "¡Todo correcto!",
        "wellDone": "¡Correcto!",
        "scoreBar": "Has conseguido :num de :total puntos",
        "scoreAt": "Has conseguido @score de @total puntos",
        "a11yCheck": "Comprobar las respuestas.",
        "a11yCheckOne": "Comprobar la respuesta.",
        "a11yShowSolution": "Mostrar la solución.",
        "a11yRetry": "Reintentar la actividad.",
        "trueText": "Verdadero",
        "falseText": "Falso",
        "wrongAnswer": "Respuesta incorrecta",
        "correctAnswer": "Respuesta correcta",
        "tipLabel": "Mostrar pista",
        "tipAvailable": "Hay una pista disponible",
        "feedbackAvailable": "Hay comentarios disponibles",
        "readFeedback": "Leer comentarios",
        "shouldCheck": "Debía estar marcada",
        "shouldNotCheck": "No debía estar marcada",
        "noInput": "Responde antes de ver la solución",
        "submitAnswerButton": "Enviar respuesta",
        "confirmCheckHeader": "¿Terminar?",
        "confirmCheckBody": "¿Quieres comprobar la respuesta?",
        "confirmRetryHeader": "¿Reintentar?",
        "confirmRetryBody": "Se borrarán tus respuestas.",
        "cancel": "Cancelar",
        "memCardTurns": "Movimientos",
        "memTimeSpent": "Tiempo empleado",
        "memFeedback": "¡Muy bien!",
        "memClose": "Cerrar",
        "memLabel": "Juego de memoria. Encuentra las parejas.",
        "memInstructions": "Usa las flechas y espacio o enter para girar las cartas.",
        "memDone": "Has encontrado todas las parejas.",
        "memCardPrefix": "Carta %num de %total:",
        "memCardUnturned": "Sin girar. Pulsa para girar.",
        "memCardTurned": "Carta girada.",
        "memCardMatched": "Pareja encontrada.",
        "memCardMatchedA11y": "¡Las cartas coinciden!",
        "memCardNotMatchedA11y": "No coinciden. Prueba con otras cartas.",
    },
    "ca": {
        "check": "Comprova",
        "submit": "Envia",
        "retryShort": "Reintenta",
        "retryLong": "Torna-ho a provar",
        "showSolution": "Mostra la solució",
        "correct": "Correcte.",
        "incorrect": "Torna-ho a provar.",
        "tryHarder": "Segueix intentant-ho.",
        "allCorrect": "Tot correcte!",
        "wellDone": "Correcte!",
        "scoreBar": "Has aconseguit :num de :total punts",
        "scoreAt": "Has aconseguit @score de @total punts",
        "a11yCheck": "Comprova les respostes.",
        "a11yCheckOne": "Comprova la resposta.",
        "a11yShowSolution": "Mostra la solució.",
        "a11yRetry": "Reintenta l'activitat.",
        "trueText": "Veritable",
        "falseText": "Fals",
        "wrongAnswer": "Resposta incorrecta",
        "correctAnswer": "Resposta correcta",
        "tipLabel": "Mostra la pista",
        "tipAvailable": "Hi ha una pista disponible",
        "feedbackAvailable": "Hi ha comentaris disponibles",
        "readFeedback": "Llig els comentaris",
        "shouldCheck": "Havia d'estar marcada",
        "shouldNotCheck": "No havia d'estar marcada",
        "noInput": "Respon abans de vore la solució",
        "submitAnswerButton": "Envia la resposta",
        "confirmCheckHeader": "Acabar?",
        "confirmCheckBody": "Vols comprovar la resposta?",
        "confirmRetryHeader": "Reintentar?",
        "confirmRetryBody": "S'esborraran les teues respostes.",
        "cancel": "Cancel·la",
        "memCardTurns": "Moviments",
        "memTimeSpent": "Temps emprat",
        "memFeedback": "Molt bé!",
        "memClose": "Tanca",
        "memLabel": "Joc de memòria. Troba les parelles.",
        "memInstructions": "Usa les fletxes i espai o enter per girar les cartes.",
        "memDone": "Has trobat totes les parelles.",
        "memCardPrefix": "Carta %num de %total:",
        "memCardUnturned": "Sense girar. Prem per girar.",
        "memCardTurned": "Carta girada.",
        "memCardMatched": "Parella trobada.",
        "memCardMatchedA11y": "Les cartes coincideixen!",
        "memCardNotMatchedA11y": "No coincideixen. Prova amb altres cartes.",
    },
    "en": {
        "check": "Check",
        "submit": "Submit",
        "retryShort": "Retry",
        "retryLong": "Try again",
        "showSolution": "Show solution",
        "correct": "Correct.",
        "incorrect": "Try again.",
        "tryHarder": "Keep trying.",
        "allCorrect": "All correct!",
        "wellDone": "Correct!",
        "scoreBar": "You got :num of :total points",
        "scoreAt": "You got @score of @total points",
        "a11yCheck": "Check the answers.",
        "a11yCheckOne": "Check the answer.",
        "a11yShowSolution": "Show the solution.",
        "a11yRetry": "Retry the activity.",
        "trueText": "True",
        "falseText": "False",
        "wrongAnswer": "Wrong answer",
        "correctAnswer": "Correct answer",
        "tipLabel": "Show tip",
        "tipAvailable": "A tip is available",
        "feedbackAvailable": "Feedback is available",
        "readFeedback": "Read feedback",
        "shouldCheck": "Should have been checked",
        "shouldNotCheck": "Should not have been checked",
        "noInput": "Answer before viewing the solution",
        "submitAnswerButton": "Submit answer",
        "confirmCheckHeader": "Finish?",
        "confirmCheckBody": "Do you want to check the answer?",
        "confirmRetryHeader": "Retry?",
        "confirmRetryBody": "Your answers will be deleted.",
        "cancel": "Cancel",
        "memCardTurns": "Moves",
        "memTimeSpent": "Time spent",
        "memFeedback": "Well done!",
        "memClose": "Close",
        "memLabel": "Memory game. Find the matching pairs.",
        "memInstructions": "Use the arrow keys and space or enter to turn the cards.",
        "memDone": "You found all the pairs.",
        "memCardPrefix": "Card %num of %total:",
        "memCardUnturned": "Not turned. Press to turn.",
        "memCardTurned": "Card turned.",
        "memCardMatched": "Pair found.",
        "memCardMatchedA11y": "The cards match!",
        "memCardNotMatchedA11y": "They do not match. Try other cards.",
    },
}


def activity_language(payload: dict) -> str:
    language = str(payload.get("language", "") or "").strip().lower()
    return language if language in H5P_TEXT else "es"


def activity_content(activity: dict) -> dict:
    t = H5P_TEXT.get(str(activity.get("language") or "es"), H5P_TEXT["es"])
    if activity.get("type") in {"classify", "ordering"}:
        elements = []
        drop_zones = []
        for index, item in enumerate(activity["items"]):
            elements.append({"type": {"library": "H5P.AdvancedText 1.1", "params": {"text": f"<p>{safe_text(item['text'])}</p>"}}, "x": 5 + (index % 3) * 30, "y": 6 + (index // 3) * 12, "height": 5, "width": 24, "dropZones": [int(item["category"])], "backgroundOpacity": 100, "multiple": False})
        for index, category in enumerate(activity["categories"]):
            top = 65 + (index % 2) * 17
            left = 5 + (index // 2) * 48
            drop_zones.append({"label": safe_text(category["name"]), "showLabel": True, "x": left, "y": top, "height": 13, "width": 42, "correctElements": [item_index for item_index, item in enumerate(activity["items"]) if int(item["category"]) == index], "backgroundOpacity": 100, "tipsAndFeedback": {"tip": "", "feedbackOnCorrect": t["correct"], "feedbackOnIncorrect": t["incorrect"]}})
        return {
            "scoreShow": t["check"], "submit": t["submit"], "tryAgain": t["retryShort"],
            "question": {"settings": {"questionTitle": safe_text(activity["question"]), "size": {"width": 620, "height": 310}}, "task": {"elements": elements, "dropZones": drop_zones}},
            "behaviour": {"enableRetry": True, "enableCheckButton": True, "singlePoint": False, "applyPenalties": True, "enableScoreExplanation": True, "dropZoneHighlighting": "dragging", "enableFullScreen": False},
            "overallFeedback": [{"from": 0, "to": 99, "feedback": t["tryHarder"]}, {"from": 100, "to": 100, "feedback": t["allCorrect"]}],
            "scoreBarLabel": t["scoreBar"], "a11yCheck": t["a11yCheck"], "a11yRetry": t["a11yRetry"],
        }
    if activity.get("type") == "matching":
        elements = []
        drop_zones = []
        for index, pair in enumerate(activity["pairs"]):
            top = 8 + index * 16
            elements.append({"type": {"library": "H5P.AdvancedText 1.1", "params": {"text": f"<p>{safe_text(pair['left'])}</p>"}}, "x": 5, "y": top, "height": 3, "width": 12, "dropZones": [index], "backgroundOpacity": 100, "multiple": False})
            drop_zones.append({"label": safe_text(pair["right"]), "showLabel": True, "x": 55, "y": top, "height": 3, "width": 18, "correctElements": [index], "backgroundOpacity": 100, "tipsAndFeedback": {"tip": "", "feedbackOnCorrect": t["correct"], "feedbackOnIncorrect": t["incorrect"]}})
        return {
            "scoreShow": t["check"], "submit": t["submit"], "tryAgain": t["retryShort"],
            "question": {"settings": {"questionTitle": safe_text(activity["question"]), "size": {"width": 620, "height": 310}}, "task": {"elements": elements, "dropZones": drop_zones}},
            "behaviour": {"enableRetry": True, "enableCheckButton": True, "singlePoint": False, "applyPenalties": True, "enableScoreExplanation": True, "dropZoneHighlighting": "dragging", "enableFullScreen": False},
            "overallFeedback": [{"from": 0, "to": 99, "feedback": t["tryHarder"]}, {"from": 100, "to": 100, "feedback": t["allCorrect"]}],
            "scoreBarLabel": t["scoreBar"], "a11yCheck": t["a11yCheck"], "a11yRetry": t["a11yRetry"],
        }
    if activity.get("type") == "memory":
        return {
            "cards": [
                {"image": {"path": f"card-{index}.svg", "mime": "image/svg+xml", "width": 320, "height": 180}, "imageAlt": safe_text(card["text"])}
                for index, card in enumerate(activity["cards"])
            ],
            "behaviour": {"useGrid": True, "allowRetry": True},
            "l10n": {
                "cardTurns": t["memCardTurns"], "timeSpent": t["memTimeSpent"], "feedback": t["memFeedback"],
                "tryAgain": t["retryShort"], "closeLabel": t["memClose"], "label": t["memLabel"],
                "labelInstructions": t["memInstructions"],
                "done": t["memDone"], "cardPrefix": t["memCardPrefix"],
                "cardUnturned": t["memCardUnturned"], "cardTurned": t["memCardTurned"],
                "cardMatched": t["memCardMatched"], "cardMatchedA11y": t["memCardMatchedA11y"],
                "cardNotMatchedA11y": t["memCardNotMatchedA11y"],
            },
        }
    if activity.get("type") == "true-false":
        return {
            "question": f"<p>{safe_text(activity['question'])}</p>",
            "correct": "true" if activity["correct"] else "false",
            "l10n": {
                "trueText": t["trueText"],
                "falseText": t["falseText"],
                "score": t["scoreAt"],
                "checkAnswer": t["check"],
                "submitAnswer": t["submit"],
                "showSolutionButton": t["showSolution"],
                "tryAgain": t["retryLong"],
                "wrongAnswerMessage": t["wrongAnswer"],
                "correctAnswerMessage": t["correctAnswer"],
                "scoreBarLabel": t["scoreBar"],
                "a11yCheck": t["a11yCheckOne"],
                "a11yShowSolution": t["a11yShowSolution"],
                "a11yRetry": t["a11yRetry"],
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
            "showSolutionButton": t["showSolution"],
            "tryAgainButton": t["retryLong"],
            "checkAnswerButton": t["check"],
            "tipsLabel": t["tipLabel"],
            "scoreBarLabel": t["scoreBar"],
            "tipAvailable": t["tipAvailable"],
            "feedbackAvailable": t["feedbackAvailable"],
            "readFeedback": t["readFeedback"],
            "wrongAnswer": t["wrongAnswer"],
            "correctAnswer": t["correctAnswer"],
            "shouldCheck": t["shouldCheck"],
            "shouldNotCheck": t["shouldNotCheck"],
            "noInput": t["noInput"],
            "submitAnswerButton": t["submitAnswerButton"],
            "a11yCheck": t["a11yCheck"],
            "a11yShowSolution": t["a11yShowSolution"],
            "a11yRetry": t["a11yRetry"],
        },
        "overallFeedback": [
            {"from": 0, "to": 99, "feedback": t["tryHarder"]},
            {"from": 100, "to": 100, "feedback": t["wellDone"]},
        ],
        "confirmCheck": {"header": t["confirmCheckHeader"], "body": t["confirmCheckBody"], "cancelLabel": t["cancel"], "confirmLabel": t["check"]},
        "confirmRetry": {"header": t["confirmRetryHeader"], "body": t["confirmRetryBody"], "cancelLabel": t["cancel"], "confirmLabel": t["retryShort"]},
    }


def package_files(activity: dict) -> dict[str, bytes]:
    if activity.get("type") in {"matching", "classify", "ordering"}:
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
    if activity.get("type") not in {"memory", "matching", "classify", "ordering"}:
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
    language = activity_language(payload)
    metadata, metadata_errors = activity_metadata(payload)
    errors.extend(metadata_errors)
    if activity_type == "true-false":
        if not title:
            errors.append("Escribe un título.")
        if not question:
            errors.append("Escribe una descripción.")
        correct = payload.get("correct")
        if not isinstance(correct, bool):
            errors.append("Elige si la afirmación es verdadera o falsa.")
        if errors:
            return None, errors
        return {"type": activity_type, "title": title[:200], "question": question[:2000], "correct": correct, "language": language, **metadata}, []
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
        return {"type": activity_type, "title": title[:200], "question": question[:2000], "cards": cleaned, "language": language, **metadata}, []
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
        return {"type": activity_type, "title": title[:200], "question": question[:2000], "pairs": cleaned, "language": language, **metadata}, []
    if activity_type in {"classify", "ordering"}:
        categories = payload.get("categories")
        items = payload.get("items")
        if not title:
            errors.append("Escribe un título.")
        if not question:
            errors.append("Escribe una descripción.")
        max_categories = 12 if activity_type == "ordering" else 4
        if not isinstance(categories, list) or not 2 <= len(categories) <= max_categories:
            errors.append(f"Añade entre 2 y {max_categories} categorías.")
            categories = []
        cleaned_categories = [{"name": str(category.get("name", "")).strip()[:120]} for category in categories if isinstance(category, dict) and str(category.get("name", "")).strip()]
        if len(cleaned_categories) != len(categories):
            errors.append("Cada categoría debe tener un nombre.")
        if not isinstance(items, list) or not 3 <= len(items) <= 12:
            errors.append("Añade entre 3 y 12 elementos.")
            items = []
        cleaned_items = []
        for item in items:
            if not isinstance(item, dict) or not str(item.get("text", "")).strip():
                continue
            try:
                category = int(item.get("category"))
            except (TypeError, ValueError):
                category = -1
            cleaned_items.append({"text": str(item["text"]).strip()[:120], "category": category})
        if len(cleaned_items) != len(items) or any(item["category"] < 0 or item["category"] >= len(cleaned_categories) for item in cleaned_items):
            errors.append("Cada elemento debe tener texto y una categoría válida.")
        if errors:
            return None, errors
        return {"type": activity_type, "title": title[:200], "question": question[:2000], "categories": cleaned_categories, "items": cleaned_items, "language": language, **metadata}, []
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
    return {"type": activity_type, "title": title[:200], "question": question[:2000], "answers": cleaned, "language": language, **metadata}, []


def activity_metadata(payload: dict) -> tuple[dict, list[str]]:
    """Keep optional catalogue metadata without accepting arbitrary HTML."""

    errors = []
    metadata = {
        "description": str(payload.get("description", "")).strip()[:2000],
        "subject": str(payload.get("subject", "")).strip()[:120],
        "educational_stage": str(payload.get("educational_stage", "")).strip()[:120],
        "license": str(payload.get("license", "CC BY-SA") or "CC BY-SA").strip()[:80],
        "author_pseudonym": str(payload.get("author_pseudonym", "")).strip()[:120],
    }
    tags = payload.get("tags", [])
    if tags is None:
        tags = []
    if not isinstance(tags, list):
        errors.append("Las etiquetas deben ser una lista.")
        tags = []
    metadata["tags"] = list(dict.fromkeys(str(tag).strip()[:80] for tag in tags if str(tag).strip()))[:20]
    return metadata, errors


class Handler(BaseHTTPRequestHandler):
    server_version = "EduTicTacPlay/0.1"

    def send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def normalize_path(self, raw: str) -> str:
        path = unquote(urlparse(raw).path)
        if URL_PREFIX and (path == URL_PREFIX or path.startswith(URL_PREFIX + "/")):
            path = path[len(URL_PREFIX):] or "/"
        return path

    def do_GET(self) -> None:  # noqa: N802
        path = self.normalize_path(self.path)
        if path == "/api/health":
            self.send_json(HTTPStatus.OK, {"status": "ok", "service": "edutictac-play"})
            return
        if path == "/api/activities":
            query = parse_qs(urlparse(self.path).query)
            try:
                limit = max(1, min(100, int(query.get("limit", ["20"])[0])))
                offset = max(0, int(query.get("offset", ["0"])[0]))
            except ValueError:
                self.send_json(HTTPStatus.BAD_REQUEST, {"error": "Paginación no válida."})
                return
            filters = {
                "limit": limit,
                "offset": offset,
                "type": query.get("type", [""])[0],
                "language": query.get("language", [""])[0],
                "subject": query.get("subject", [""])[0],
                "educational_stage": query.get("educational_stage", [""])[0],
                "license": query.get("license", [""])[0],
                "tag": query.get("tag", [""])[0],
                "q": query.get("q", [""])[0],
            }
            items, total = list_activities(filters)
            self.send_json(HTTPStatus.OK, {
                "items": [activity_summary(activity) for activity in items],
                "total": total,
                "limit": limit,
                "offset": offset,
                "hasMore": offset + len(items) < total,
            })
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
        match = re.fullmatch(rf"/api/activities/({ACTIVITY_ID_PATTERN})/h5p/(.+)", path)
        if match:
            activity = read_activity(match.group(1))
            if not activity:
                self.send_error(HTTPStatus.NOT_FOUND)
                return
            files = package_files(activity)
            body = files.get(match.group(2))
            if body is None:
                self.send_error(HTTPStatus.NOT_FOUND)
                return
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", content_type_for(Path(match.group(2))))
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

    def admin_authorized(self) -> bool:
        if not PLAY_ADMIN_TOKEN:
            return False
        token = self.headers.get("X-Admin-Token", "").strip()
        if not token:
            authorization = self.headers.get("Authorization", "")
            if authorization.lower().startswith("bearer "):
                token = authorization[7:].strip()
        return secrets.compare_digest(token, PLAY_ADMIN_TOKEN)

    def do_DELETE(self) -> None:  # noqa: N802
        path = self.normalize_path(self.path)
        match = re.fullmatch(rf"/api/activities/({ACTIVITY_ID_PATTERN})", path)
        if not match:
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "Ruta no encontrada."})
            return
        if not self.admin_authorized():
            self.send_json(HTTPStatus.FORBIDDEN, {"error": "Borrado no autorizado."})
            return
        if not delete_activity(match.group(1)):
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "Actividad no encontrada."})
            return
        self.send_json(HTTPStatus.OK, {"deleted": match.group(1)})

    def do_POST(self) -> None:  # noqa: N802
        route = self.normalize_path(self.path)
        if route == "/api/commons/launch":
            self.consume_commons_launch()
            return
        if route == "/api/commons/score":
            self.forward_commons_score()
            return
        if route == "/api/recursos/publish":
            self.publish_recursos_activity()
            return
        if route == "/api/recursos/unpublish":
            self.unpublish_recursos_activity()
            return
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

    def publish_recursos_activity(self) -> None:
        if not RECURSOS_API_URL or not RECURSOS_INGEST_TOKEN or not PLAY_PUBLIC_URL:
            self.send_json(HTTPStatus.SERVICE_UNAVAILABLE, {"error": "La integración con Recursos no está configurada."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 4096:
                raise ValueError("El contenido es demasiado grande.")
            payload = json.loads(self.rfile.read(length))
            activity_id = str(payload.get("activity_id", "")).strip()
            if not ID_RE.fullmatch(activity_id):
                raise ValueError("Actividad no válida.")
            activity = read_activity(activity_id)
            if not activity:
                self.send_json(HTTPStatus.NOT_FOUND, {"error": "Actividad no encontrada."})
                return
            publish_payload = build_publish_payload(activity, public_base_url=PLAY_PUBLIC_URL)
            upstream = UpstreamRequest(
                f"{RECURSOS_API_URL}/api/integrations/recursos/activities/{activity_id}/publish",
                data=json.dumps(publish_payload, ensure_ascii=False).encode(),
                headers={"Authorization": f"Bearer {RECURSOS_INGEST_TOKEN}", "Content-Type": "application/json"},
                method="POST",
            )
            with urlopen(upstream, timeout=10) as response:
                body = response.read()
                status = response.status
        except (ValueError, json.JSONDecodeError, RecursosContractError) as exc:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(exc)})
            return
        except HTTPError as exc:
            try:
                body = exc.read()
                payload = json.loads(body.decode())
            except (OSError, ValueError, json.JSONDecodeError):
                payload = {"error": "Recursos rechazó la publicación."}
            self.send_json(exc.code, payload)
            return
        except (URLError, TimeoutError, OSError):
            self.send_json(HTTPStatus.BAD_GATEWAY, {"error": "No se ha podido contactar con Recursos."})
            return
        try:
            response_payload = json.loads(body.decode())
        except (ValueError, json.JSONDecodeError):
            response_payload = {"error": "Respuesta no válida de Recursos."}
        if status < 300 and isinstance(response_payload, dict):
            activity["recursos"] = response_payload
            save_activity(activity)
        self.send_json(status, response_payload)

    def unpublish_recursos_activity(self) -> None:
        if not RECURSOS_API_URL or not RECURSOS_INGEST_TOKEN:
            self.send_json(HTTPStatus.SERVICE_UNAVAILABLE, {"error": "La integración con Recursos no está configurada."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 4096:
                raise ValueError("El contenido es demasiado grande.")
            payload = json.loads(self.rfile.read(length))
            activity_id = str(payload.get("activity_id", "")).strip()
            if not ID_RE.fullmatch(activity_id):
                raise ValueError("Actividad no válida.")
            activity = read_activity(activity_id)
            if not activity:
                self.send_json(HTTPStatus.NOT_FOUND, {"error": "Actividad no encontrada."})
                return
            upstream = UpstreamRequest(
                f"{RECURSOS_API_URL}/api/integrations/recursos/activities/{activity_id}/unpublish",
                data=b"",
                headers={"Authorization": f"Bearer {RECURSOS_INGEST_TOKEN}"},
                method="POST",
            )
            with urlopen(upstream, timeout=10) as response:
                body = response.read()
                status = response.status
        except (ValueError, json.JSONDecodeError) as exc:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(exc)})
            return
        except HTTPError as exc:
            try:
                response_payload = json.loads(exc.read().decode())
            except (OSError, ValueError, json.JSONDecodeError):
                response_payload = {"error": "Recursos rechazó la retirada."}
            self.send_json(exc.code, response_payload)
            return
        except (URLError, TimeoutError, OSError):
            self.send_json(HTTPStatus.BAD_GATEWAY, {"error": "No se ha podido contactar con Recursos."})
            return
        try:
            response_payload = json.loads(body.decode())
        except (ValueError, json.JSONDecodeError):
            response_payload = {"error": "Respuesta no válida de Recursos."}
        if status < 300 and isinstance(response_payload, dict):
            activity["recursos"] = response_payload
            save_activity(activity)
        self.send_json(status, response_payload)

    def forward_commons_score(self) -> None:
        if not COMMONS_API_URL:
            self.send_json(HTTPStatus.NOT_IMPLEMENTED, {"error": "La integración con Commons no está configurada."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 32 * 1024:
                raise ValueError("El contenido es demasiado grande.")
            payload = json.loads(self.rfile.read(length))
            activity_id = str(payload.get("activity_id", "")).strip()
            assignment_id = str(payload.get("assignment_id", "")).strip()
            result_id = str(payload.get("result_id", "")).strip()
            launch_context = str(payload.get("launch_context", "")).strip()
            score = int(payload.get("score"))
            metadata = payload.get("metadata", {})
            if not ID_RE.fullmatch(activity_id) or not assignment_id or len(result_id) > 512 or not isinstance(metadata, dict):
                raise ValueError("Datos de resultado no válidos.")
            if score < 0 or score > 100:
                raise ValueError("La puntuación debe estar entre 0 y 100.")
        except (TypeError, ValueError, json.JSONDecodeError):
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": "Datos de resultado no válidos."})
            return
        context = LAUNCH_CONTEXTS.get(launch_context) if launch_context else None
        if launch_context:
            if not context or context["expires_at"] <= time.time():
                LAUNCH_CONTEXTS.pop(launch_context, None)
                self.send_json(HTTPStatus.UNAUTHORIZED, {"error": "Lanzamiento de Commons caducado."})
                return
            if context["assignment_id"] != assignment_id or context["activity_id"] != activity_id:
                self.send_json(HTTPStatus.FORBIDDEN, {"error": "La actividad no coincide con el lanzamiento."})
                return
            if not context["identity_id"] or not COMMONS_APP_TOKEN:
                self.send_json(HTTPStatus.NOT_IMPLEMENTED, {"error": "El lanzamiento no tiene identidad válida."})
                return
            upstream_path = f"/api/apps/{COMMONS_APP_ID}/scores"
            upstream_payload = {
                "identity_id": context["identity_id"],
                "activity_id": activity_id,
                "assignment_id": assignment_id,
                "result_id": result_id,
                "score": score,
                "metadata": metadata,
            }
            upstream_headers = {"Authorization": f"Bearer {COMMONS_APP_TOKEN}"}
        else:
            upstream_path = "/api/scores"
            upstream_payload = {
                "app_id": COMMONS_APP_ID,
                "activity_id": activity_id,
                "assignment_id": assignment_id,
                "result_id": result_id,
                "score": score,
                "metadata": metadata,
            }
            upstream_headers = {"Cookie": self.headers.get("Cookie", "")}
        body = json.dumps(upstream_payload).encode()
        upstream_headers.update({"Content-Type": "application/json", "Accept": "application/json"})
        request = UpstreamRequest(
            f"{COMMONS_API_URL}{upstream_path}",
            data=body,
            headers=upstream_headers,
            method="POST",
        )
        try:
            with urlopen(request, timeout=5) as response:
                response_body = response.read()
                status = response.status
        except HTTPError as error:
            response_body = error.read()
            status = error.code
        except URLError:
            self.send_json(HTTPStatus.BAD_GATEWAY, {"error": "No se ha podido contactar con Commons."})
            return
        try:
            result = json.loads(response_body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            result = {"error": "Respuesta no válida de Commons."}
        self.send_json(status, result if isinstance(result, dict) else {"result": result})

    def consume_commons_launch(self) -> None:
        if not COMMONS_API_URL or not COMMONS_APP_TOKEN:
            self.send_json(HTTPStatus.NOT_IMPLEMENTED, {"error": "Los lanzamientos de Commons no están configurados."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 8 * 1024:
                raise ValueError("El contenido es demasiado grande.")
            payload = json.loads(self.rfile.read(length))
            token = str(payload.get("token", "")).strip()
            if not token or len(token) > 512:
                raise ValueError("Token no válido.")
        except (TypeError, ValueError, json.JSONDecodeError):
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": "Token de lanzamiento no válido."})
            return
        body = json.dumps({"token": token}).encode()
        request = UpstreamRequest(
            f"{COMMONS_API_URL}/api/apps/{COMMONS_APP_ID}/launch-tokens/consume",
            data=body,
            headers={
                "Authorization": f"Bearer {COMMONS_APP_TOKEN}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            method="POST",
        )
        try:
            with urlopen(request, timeout=5) as response:
                response_body = response.read()
                status = response.status
        except HTTPError as error:
            response_body = error.read()
            status = error.code
        except URLError:
            self.send_json(HTTPStatus.BAD_GATEWAY, {"error": "No se ha podido contactar con Commons."})
            return
        try:
            result = json.loads(response_body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self.send_json(HTTPStatus.BAD_GATEWAY, {"error": "Respuesta no válida de Commons."})
            return
        if status >= 400 or not isinstance(result, dict):
            self.send_json(status, result if isinstance(result, dict) else {"error": "Lanzamiento no válido."})
            return
        assignment = result.get("assignment") or {}
        if assignment.get("app_id") != COMMONS_APP_ID or not assignment.get("id") or not assignment.get("activity_id"):
            self.send_json(HTTPStatus.BAD_GATEWAY, {"error": "Asignación no válida de Commons."})
            return
        context_id = secrets.token_urlsafe(32)
        LAUNCH_CONTEXTS[context_id] = {
            "identity_id": (result.get("identity") or {}).get("id", ""),
            "assignment_id": assignment["id"],
            "activity_id": assignment["activity_id"],
            "expires_at": time.time() + 3600,
        }
        self.send_json(HTTPStatus.OK, {"context_id": context_id, "assignment": assignment})

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
        activity_match = re.fullmatch(rf"/({ACTIVITY_ID_PATTERN})", path)
        if activity_match and read_activity(activity_match.group(1)):
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
    folder.mkdir(parents=True, exist_ok=True)
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


def activity_matches(activity: dict, filters: dict) -> bool:
    for key in ("type", "language", "subject", "educational_stage", "license"):
        value = filters.get(key)
        if value and str(activity.get(key, "")).lower() != value.lower():
            return False
    tag = filters.get("tag")
    if tag and tag.lower() not in [str(item).lower() for item in activity.get("tags", [])]:
        return False
    query = filters.get("q")
    if query:
        haystack = f"{activity.get('title', '')} {activity.get('question', '')} {activity.get('description', '')}".lower()
        if query.lower() not in haystack:
            return False
    return True


def list_activities(filters: dict) -> tuple[list[dict], int]:
    """Return a page of saved activities (newest first) and the total after filters."""

    items = []
    if ACTIVITIES_DIR.exists():
        for folder in ACTIVITIES_DIR.iterdir():
            if not folder.is_dir() or not ID_RE.fullmatch(folder.name):
                continue
            activity = read_activity(folder.name)
            if activity:
                items.append(activity)
    items.sort(key=lambda activity: activity.get("createdAt", ""), reverse=True)
    matches = [activity for activity in items if activity_matches(activity, filters)]
    offset = filters["offset"]
    return matches[offset:offset + filters["limit"]], len(matches)


def activity_summary(activity: dict) -> dict:
    return {
        "id": activity.get("id"),
        "type": activity.get("type"),
        "title": activity.get("title"),
        "question": activity.get("question"),
        "language": activity.get("language"),
        "createdAt": activity.get("createdAt"),
        "description": activity.get("description", ""),
        "subject": activity.get("subject", ""),
        "educational_stage": activity.get("educational_stage", ""),
        "license": activity.get("license", ""),
        "author_pseudonym": activity.get("author_pseudonym", ""),
        "tags": activity.get("tags", []),
    }


def delete_activity(activity_id: str) -> bool:
    if not ID_RE.fullmatch(activity_id):
        return False
    folder = ACTIVITIES_DIR / activity_id
    if not (folder / "activity.json").is_file():
        return False
    shutil.rmtree(folder)
    return True


def main() -> None:
    ACTIVITIES_DIR.mkdir(parents=True, exist_ok=True)
    port = int(os.environ.get("PORT", "8083"))
    ThreadingHTTPServer((HOST, port), Handler).serve_forever()


if __name__ == "__main__":
    main()
