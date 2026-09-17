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
import uuid
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
PLAY_DEFAULT_VISIBILITY = os.environ.get("PLAY_DEFAULT_VISIBILITY", "public").strip().lower()
# Solo debe configurarse detrás de un proxy que elimine y vuelva a establecer
# esta cabecera a partir de una identidad OIDC validada.
PLAY_TRUSTED_IDENTITY_HEADER = os.environ.get("PLAY_TRUSTED_IDENTITY_HEADER", "").strip()
PLAY_CONTROLLED_CATALOG = os.environ.get("PLAY_CONTROLLED_CATALOG", "1").strip().lower() not in {"0", "false", "no"}
ID_RE = re.compile(r"^[A-Za-z0-9]{8}$")
PREVIEW_RE = re.compile(r"^preview-[A-Za-z0-9]{8}$")
PREVIEWS: dict[str, dict] = {}
LAUNCH_CONTEXTS: dict[str, dict] = {}
ACTIVITY_ID_PATTERN = r"(?:[A-Za-z0-9]{8}|preview-[A-Za-z0-9]{8})"

COMPOUND_CHILD_TYPES = {
    "multiple-choice",
    "true-false",
    "fill-blanks",
    "drag-text",
    "mark-words",
    "matching",
    "classify",
    "ordering",
}
VISIBILITIES = {"private", "class", "public"}
CATALOG_DEFAULTS = {
    "subjects": ["ciencias", "lenguas", "matematicas", "sociales", "arte", "tecnologia", "educacion-fisica", "tutoria"],
    "educational_stages": ["infantil", "primaria", "secundaria", "bachillerato", "fp", "adultos"],
    "levels": ["inicial", "basico", "intermedio", "avanzado"],
    "tags": ["ciencias", "repaso", "vocabulario", "comprension", "calculo", "creatividad", "investigacion"],
}
CATALOG_LABELS_DEFAULT = {
    "ciencias": {"es": "Ciencias", "ca": "Ciències", "en": "Science"},
    "lenguas": {"es": "Lenguas", "ca": "Llengües", "en": "Languages"},
    "matematicas": {"es": "Matemáticas", "ca": "Matemàtiques", "en": "Mathematics"},
    "sociales": {"es": "Ciencias sociales", "ca": "Ciències socials", "en": "Social sciences"},
    "arte": {"es": "Arte", "ca": "Art", "en": "Art"},
    "tecnologia": {"es": "Tecnología", "ca": "Tecnologia", "en": "Technology"},
    "educacion-fisica": {"es": "Educación física", "ca": "Educació física", "en": "Physical education"},
    "tutoria": {"es": "Tutoría", "ca": "Tutoria", "en": "Tutoring"},
    "infantil": {"es": "Infantil", "ca": "Infantil", "en": "Early years"},
    "primaria": {"es": "Primaria", "ca": "Primària", "en": "Primary"},
    "secundaria": {"es": "Secundaria", "ca": "Secundària", "en": "Secondary"},
    "bachillerato": {"es": "Bachillerato", "ca": "Batxillerat", "en": "Sixth form"},
    "fp": {"es": "FP", "ca": "FP", "en": "Vocational training"},
    "adultos": {"es": "Personas adultas", "ca": "Persones adultes", "en": "Adult education"},
    "inicial": {"es": "Inicial", "ca": "Inicial", "en": "Beginner"},
    "basico": {"es": "Básico", "ca": "Bàsic", "en": "Basic"},
    "intermedio": {"es": "Intermedio", "ca": "Intermedi", "en": "Intermediate"},
    "avanzado": {"es": "Avanzado", "ca": "Avançat", "en": "Advanced"},
    "ciencias": {"es": "Ciencias", "ca": "Ciències", "en": "Science"},
    "repaso": {"es": "Repaso", "ca": "Repàs", "en": "Revision"},
    "vocabulario": {"es": "Vocabulario", "ca": "Vocabulari", "en": "Vocabulary"},
    "comprension": {"es": "Comprensión", "ca": "Comprensió", "en": "Comprehension"},
    "calculo": {"es": "Cálculo", "ca": "Càlcul", "en": "Calculation"},
    "creatividad": {"es": "Creatividad", "ca": "Creativitat", "en": "Creativity"},
    "investigacion": {"es": "Investigación", "ca": "Investigació", "en": "Research"},
}


def h5p_library_for_activity(activity: dict) -> str:
    """Return the exact child library version accepted by QuestionSet."""

    activity_type = activity.get("type")
    if activity_type == "multiple-choice":
        return "H5P.MultiChoice 1.16"
    if activity_type == "true-false":
        return "H5P.TrueFalse 1.8"
    if activity_type == "fill-blanks":
        return "H5P.Blanks 1.14"
    if activity_type == "drag-text":
        return "H5P.DragText 1.10"
    if activity_type == "mark-words":
        return "H5P.MarkTheWords 1.11"
    if activity_type in {"matching", "classify", "ordering"}:
        return "H5P.DragQuestion 1.15"
    raise ValueError(f"Unsupported QuestionSet child: {activity_type}")


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
    if activity.get("type") == "compound":
        questions = []
        for child in activity["activities"]:
            params = activity_content(child)
            params["contentName"] = safe_text(child["title"], 200)
            questions.append({
                "library": h5p_library_for_activity(child),
                "params": params,
                "subContentId": str(uuid.uuid4()),
            })
        return {
            "introPage": {"showIntroPage": False},
            "progressType": "dots",
            "passPercentage": int(activity.get("passPercentage", 60)),
            "questions": questions,
            "texts": {
                "prevButton": "Anterior", "previous": "Anterior",
                "nextButton": "Siguiente", "next": "Siguiente",
                "finishButton": "Finalizar", "submitButton": "Enviar",
                "textualProgress": "Pregunta @current de @total",
                "jumpToQuestion": "Pregunta %d de %total",
                "questionLabel": "Actividad",
                "readSpeakerProgress": "Actividad @current de @total",
                "unansweredText": "Sin responder", "answeredText": "Respondida",
                "currentQuestionText": "Actividad actual", "navigationLabel": "Actividades",
                "questionSetInstruction": "Elige la actividad que quieres mostrar",
            },
            "disableBackwardsNavigation": False,
            "randomQuestions": bool(activity.get("randomQuestions", False)),
            "endGame": {
                "showResultPage": True, "message": "Resultados del reto",
                "noResultMessage": "Reto terminado", "amountCorrect": "@finals de @totals correctas",
                "scoreBarLabel": "Has conseguido @finals de @totals puntos",
                "scoreHeader": "Puntuación", "overallFeedback": [],
                "finishButtonText": "Finalizar", "submitButtonText": "Enviar",
                "solutionButtonText": "Mostrar soluciones", "retryButtonText": "Reintentar",
                "showSolutionButton": True, "showRetryButton": True, "showAnimations": False,
            },
        }
    if activity.get("type") == "find-words":
        return {
            "taskDescription": safe_text(activity["question"]),
            "wordList": ",".join(activity["words"]),
            "behaviour": {
                "orientations": {"horizontal": True, "horizontalBack": True, "vertical": True, "verticalUp": True, "diagonal": True, "diagonalBack": True, "diagonalUp": True, "diagonalUpBack": True},
                "fillPool": "abcdefghijklmnopqrstuvwxyz",
                "preferOverlap": True,
                "showVocabulary": True,
                "enableShowSolution": True,
                "enableRetry": True,
            },
            "l10n": {
                "check": t["check"], "tryAgain": t["retryShort"], "showSolution": t["showSolution"],
                "found": t.get("foundWords", "@found de @totalWords encontradas"), "timeSpent": t.get("timeSpent", "Tiempo"),
                "score": t["scoreBar"], "wordListHeader": t.get("findWordsHeader", "Busca las palabras"),
            },
        }
    if activity.get("type") == "drag-text":
        return {
            "taskDescription": safe_text(activity["question"]),
            "textField": safe_text(activity["text"]),
            "distractors": "",
            "overallFeedback": [{"from": 0, "to": 99, "feedback": t["tryHarder"]}, {"from": 100, "to": 100, "feedback": t["allCorrect"]}],
            "checkAnswer": t["check"], "submitAnswer": t["submit"], "tryAgain": t["retryShort"], "showSolution": t["showSolution"],
            "dropZoneIndex": t.get("dropZoneIndex", "Zona @index."), "empty": t.get("emptyDropZone", "La zona @index está vacía."),
            "contains": t.get("containsDropZone", "La zona @index contiene @draggable."), "ariaDraggableIndex": t.get("ariaDraggable", "Elemento @index de @count."),
            "tipLabel": t.get("tipLabel", "Pista"), "behaviour": {"enableRetry": True, "enableSolutionsButton": True, "enableCheckButton": True, "applyPenalties": True},
        }
    if activity.get("type") == "mark-words":
        return {
            "taskDescription": safe_text(activity["question"]),
            "textField": safe_text(activity["text"]),
            "overallFeedback": [{"from": 0, "to": 99, "feedback": t["tryHarder"]}, {"from": 100, "to": 100, "feedback": t["allCorrect"]}],
            "behaviour": {"enableRetry": True, "enableSolutionsButton": True, "enableCheckButton": True, "showScorePoints": True},
            "checkAnswerButton": t["check"], "submitAnswerButton": t["submit"], "tryAgainButton": t["retryShort"], "showSolutionButton": t["showSolution"],
            "correctAnswer": t["correctAnswer"], "incorrectAnswer": t["wrongAnswer"], "missedAnswer": t.get("shouldCheck", "Respuesta no marcada"),
            "scoreBarLabel": t["scoreBar"], "a11yCheck": t["a11yCheck"], "a11yShowSolution": t["a11yShowSolution"], "a11yRetry": t["a11yRetry"],
            "a11yFullTextLabel": t.get("fullText", "Texto completo"), "a11yClickableTextLabel": t.get("clickableText", "Texto seleccionable"),
            "a11ySolutionModeHeader": t.get("solutionMode", "Solución"), "a11yCheckingHeader": t.get("checkingMode", "Comprobación"),
            "displaySolutionDescription": t.get("displaySolution", "La actividad muestra la solución."),
        }
    if activity.get("type") == "dialog-cards":
        return {
            "title": safe_text(activity["title"]), "description": safe_text(activity["question"]), "mode": "normal",
            "dialogs": [{"text": safe_text(card["front"]), "answer": safe_text(card["back"])} for card in activity["cards"]],
            "behaviour": {"enableRetry": True, "disableBackwardsNavigation": False, "scaleTextNotCard": False, "randomCards": False, "maxProficiency": 5, "quickProgression": False},
        }
    if activity.get("type") == "crossword":
        return {
            "taskDescription": safe_text(activity["question"]),
            "words": [{"answer": safe_text(word["answer"]), "clue": safe_text(word["clue"])} for word in activity["words"]],
            "solutionWord": "",
            "overallFeedback": [{"from": 0, "to": 99, "feedback": t["tryHarder"]}, {"from": 100, "to": 100, "feedback": t["allCorrect"]}],
            "theme": {"backgroundColor": "#176b5c"},
            "behaviour": {"poolSize": 0, "enableInstantFeedback": False, "scoreWords": True, "applyPenalties": False, "enableRetry": True, "enableSolutionsButton": True, "keepCorrectAnswers": False, "addExtraMarkerForEmptyCells": True},
            "l10n": {"across": "Horizontal", "down": "Vertical", "checkAnswer": t["check"], "submitAnswer": t["submit"], "tryAgain": t["retryShort"], "showSolution": t["showSolution"], "couldNotGenerateCrossword": "No se ha podido generar el crucigrama.", "couldNotGenerateCrosswordTooFewWords": "Necesitas al menos dos palabras.", "probematicWords": "No se han podido colocar algunas palabras: @words", "extraClue": "Pista adicional", "closeWindow": "Cerrar"},
            "a11y": {"crosswordGrid": "Cuadrícula del crucigrama.", "column": "Columna", "row": "Fila", "across": "Horizontal", "down": "Vertical", "empty": "Vacía", "resultFor": "Resultado para: @clue", "correct": "Correcta", "wrong": "Incorrecta", "point": "punto", "solutionFor": "La solución para @clue es: @solution", "extraClueFor": "Abrir pista adicional para @clue", "letterSevenOfNine": "Letra @position de @length", "lettersWord": "Palabra de @length letras", "check": t["a11yCheck"], "submitAndcheck": t["a11yCheck"], "showSolution": t["a11yShowSolution"], "retry": t["a11yRetry"], "yourResult": t["scoreBar"]},
        }
    if activity.get("type") == "fill-blanks":
        return {
            "text": t.get("fillInstructions", "Completa las palabras que faltan."),
            "questions": [f"<p>{safe_text(activity['text'])}</p>"],
            "overallFeedback": [{"from": 0, "to": 99, "feedback": t["tryHarder"]}, {"from": 100, "to": 100, "feedback": t["allCorrect"]}],
            "showSolutions": t["showSolution"], "tryAgain": t["retryLong"], "checkAnswer": t["check"], "submitAnswer": t["submit"],
            "answeredCorrectly": t["correctAnswer"], "answeredIncorrectly": t["wrongAnswer"], "solutionLabel": t["correctAnswer"],
            "inputLabel": t.get("blankInput", "Espacio @num de @total"), "tipLabel": t.get("tipLabel", "Pista"), "scoreBarLabel": t["scoreBar"],
            "behaviour": {"enableRetry": True, "enableSolutionsButton": True, "enableCheckButton": True, "caseSensitive": False, "showSolutionsRequiresInput": True, "autoCheck": False, "separateLines": False},
            "a11yCheck": t["a11yCheck"], "a11yShowSolution": t["a11yShowSolution"], "a11yRetry": t["a11yRetry"], "a11yHeader": t["a11yCheck"],
        }
    if activity.get("type") in {"classify", "ordering"}:
        elements = []
        drop_zones = []
        for index, item in enumerate(activity["items"]):
            elements.append({"type": {"library": "H5P.AdvancedText 1.1", "params": {"text": f"<p>{safe_text(item['text'])}</p>"}}, "x": 5 + (index % 3) * 30, "y": 6 + (index // 3) * 12, "height": 5, "width": 24, "dropZones": [int(item["category"])], "backgroundOpacity": 100, "multiple": False})
        for index, category in enumerate(activity["categories"]):
            top = 65 + (index % 2) * 17
            left = 5 + (index // 2) * 48
            label = f"Posición {index + 1}" if activity.get("type") == "ordering" else safe_text(category["name"])
            drop_zones.append({"label": label, "showLabel": True, "x": left, "y": top, "height": 13, "width": 42, "correctElements": [item_index for item_index, item in enumerate(activity["items"]) if int(item["category"]) == index], "backgroundOpacity": 100, "tipsAndFeedback": {"tip": "", "feedbackOnCorrect": t["correct"], "feedbackOnIncorrect": t["incorrect"]}})
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
    if activity.get("type") == "compound":
        main_library = "H5P.QuestionSet"
        dependencies = [
            {"machineName": "H5P.QuestionSet", "majorVersion": 1, "minorVersion": 20},
            {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
            {"machineName": "H5P.Video", "majorVersion": 1, "minorVersion": 6},
            {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
        ]
        child_dependencies = {
            "multiple-choice": [
                ("H5P.MultiChoice", 1, 16), ("H5P.Question", 1, 5),
                ("H5P.Transition", 1, 0), ("H5P.FontIcons", 1, 0),
            ],
            "true-false": [("H5P.TrueFalse", 1, 8), ("H5P.Question", 1, 5), ("H5P.FontIcons", 1, 0)],
            "fill-blanks": [("H5P.Blanks", 1, 14), ("H5P.Question", 1, 5), ("H5P.TextUtilities", 1, 3)],
            "drag-text": [("H5P.DragText", 1, 10), ("jQuery.ui", 1, 10), ("H5P.Question", 1, 5)],
            "mark-words": [("H5P.MarkTheWords", 1, 11), ("H5P.Question", 1, 5)],
            "matching": [("H5P.DragQuestion", 1, 15), ("jQuery.ui", 1, 10), ("H5P.AdvancedText", 1, 1)],
            "classify": [("H5P.DragQuestion", 1, 15), ("jQuery.ui", 1, 10), ("H5P.AdvancedText", 1, 1)],
            "ordering": [("H5P.DragQuestion", 1, 15), ("jQuery.ui", 1, 10), ("H5P.AdvancedText", 1, 1)],
        }
        existing = {(item["machineName"], item["majorVersion"], item["minorVersion"]) for item in dependencies}
        for child in activity["activities"]:
            for machine_name, major, minor in child_dependencies[child["type"]]:
                key = (machine_name, major, minor)
                if key not in existing:
                    dependencies.append({"machineName": machine_name, "majorVersion": major, "minorVersion": minor})
                    existing.add(key)
        is_true_false = False
    elif activity.get("type") in {"matching", "classify", "ordering"}:
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
    elif activity.get("type") == "fill-blanks":
        main_library = "H5P.Blanks"
        dependencies = [
            {"machineName": "H5P.Blanks", "majorVersion": 1, "minorVersion": 14},
            {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
            {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
            {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
            {"machineName": "H5P.TextUtilities", "majorVersion": 1, "minorVersion": 3},
        ]
        is_true_false = False
    elif activity.get("type") == "find-words":
        main_library = "H5P.FindTheWords"
        dependencies = [
            {"machineName": "H5P.FindTheWords", "majorVersion": 1, "minorVersion": 4},
            {"machineName": "H5P.Timer", "majorVersion": 0, "minorVersion": 4},
            {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
            {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
        ]
        is_true_false = False
    elif activity.get("type") == "drag-text":
        main_library = "H5P.DragText"
        dependencies = [
            {"machineName": "H5P.DragText", "majorVersion": 1, "minorVersion": 10},
            {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
            {"machineName": "jQuery.ui", "majorVersion": 1, "minorVersion": 10},
            {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
            {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
            {"machineName": "H5P.Components", "majorVersion": 1, "minorVersion": 0},
        ]
        is_true_false = False
    elif activity.get("type") == "mark-words":
        main_library = "H5P.MarkTheWords"
        dependencies = [
            {"machineName": "H5P.MarkTheWords", "majorVersion": 1, "minorVersion": 11},
            {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
            {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
            {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
        ]
        is_true_false = False
    elif activity.get("type") == "dialog-cards":
        main_library = "H5P.Dialogcards"
        dependencies = [
            {"machineName": "H5P.Dialogcards", "majorVersion": 1, "minorVersion": 9},
            {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5},
            {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
            {"machineName": "H5P.Audio", "majorVersion": 1, "minorVersion": 5},
            {"machineName": "H5P.Components", "majorVersion": 1, "minorVersion": 0},
        ]
        is_true_false = False
    elif activity.get("type") == "crossword":
        main_library = "H5P.Crossword"
        dependencies = [
            {"machineName": "H5P.Crossword", "majorVersion": 0, "minorVersion": 7},
            {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
            {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
            {"machineName": "H5P.Image", "majorVersion": 1, "minorVersion": 1},
        ]
        is_true_false = False
    else:
        is_true_false = activity.get("type") == "true-false"
    if activity.get("type") not in {"compound", "memory", "matching", "classify", "ordering", "fill-blanks", "find-words", "drag-text", "mark-words", "dialog-cards", "crossword"}:
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
    if activity_type == "compound":
        if not title:
            errors.append("Escribe un título para el reto.")
        if not question:
            errors.append("Escribe una descripción para el reto.")
        raw_activities = payload.get("activities")
        if not isinstance(raw_activities, list) or not 2 <= len(raw_activities) <= 10:
            errors.append("Añade entre 2 y 10 actividades al reto.")
            raw_activities = []
        cleaned_activities = []
        for child in raw_activities:
            if not isinstance(child, dict) or str(child.get("type", "")) not in COMPOUND_CHILD_TYPES:
                errors.append("El reto solo admite actividades educativas compatibles.")
                continue
            child_payload = {**child, "language": child.get("language") or language}
            cleaned_child, child_errors = validate_activity(child_payload)
            if child_errors or cleaned_child is None:
                errors.extend([f"Paso {len(cleaned_activities) + 1}: {error}" for error in child_errors])
                continue
            source_id = str(child.get("sourceActivityId", "")).strip()
            if ID_RE.fullmatch(source_id):
                cleaned_child["sourceActivityId"] = source_id
            cleaned_activities.append(cleaned_child)
        try:
            pass_percentage = int(payload.get("passPercentage", 60))
        except (TypeError, ValueError):
            pass_percentage = 60
        if not 0 <= pass_percentage <= 100:
            errors.append("El porcentaje para superar el reto debe estar entre 0 y 100.")
        if errors:
            return None, errors
        return {
            "type": "compound", "format": "question-set", "title": title[:200],
            "question": question[:2000], "language": language,
            "passPercentage": pass_percentage, "randomQuestions": bool(payload.get("randomQuestions", False)),
            "activities": cleaned_activities, "answers": [], **metadata,
        }, []
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
    if activity_type == "fill-blanks":
        text = str(payload.get("text", "")).strip()
        if not title:
            errors.append("Escribe un título.")
        if not question:
            errors.append("Escribe una descripción.")
        if len(text) < 3 or len(text) > 5000 or not re.search(r"\*[^*]+\*", text):
            errors.append("Escribe un texto con al menos una palabra entre asteriscos.")
        if errors:
            return None, errors
        return {"type": activity_type, "title": title[:200], "question": question[:2000], "text": text, "language": language, **metadata}, []
    if activity_type == "find-words":
        words = payload.get("words")
        if not title:
            errors.append("Escribe un título.")
        if not question:
            errors.append("Escribe una descripción.")
        if not isinstance(words, list) or not 4 <= len(words) <= 12:
            errors.append("Añade entre 4 y 12 palabras.")
            words = []
        cleaned_words = []
        for word in words:
            value = str(word).strip().lower()
            if value and re.fullmatch(r"[a-záéíóúüñ]+", value) and value not in cleaned_words:
                cleaned_words.append(value)
        if len(cleaned_words) != len(words):
            errors.append("Usa palabras únicas, solo con letras y sin números ni símbolos.")
        if any(len(word) > 15 for word in cleaned_words):
            errors.append("Cada palabra puede tener como máximo 15 letras.")
        if errors:
            return None, errors
        return {"type": activity_type, "title": title[:200], "question": question[:2000], "words": cleaned_words, "answers": [], "language": language, **metadata}, []
    if activity_type == "drag-text":
        text = str(payload.get("text", "")).strip()
        if not title:
            errors.append("Escribe un título.")
        if not question:
            errors.append("Escribe una descripción.")
        if len(text) < 3 or len(text) > 5000 or not re.search(r"\*[^*]+\*", text):
            errors.append("Escribe un texto con al menos una palabra entre asteriscos.")
        if errors:
            return None, errors
        return {"type": activity_type, "title": title[:200], "question": question[:2000], "text": text, "answers": [], "language": language, **metadata}, []
    if activity_type == "mark-words":
        text = str(payload.get("text", "")).strip()
        if not title:
            errors.append("Escribe un título.")
        if not question:
            errors.append("Escribe una descripción.")
        if len(text) < 3 or len(text) > 5000 or not re.search(r"\*[^*]+\*", text):
            errors.append("Escribe un texto con al menos una palabra entre asteriscos.")
        if errors:
            return None, errors
        return {"type": activity_type, "title": title[:200], "question": question[:2000], "text": text, "answers": [], "language": language, **metadata}, []
    if activity_type == "dialog-cards":
        cards = payload.get("cards")
        if not title:
            errors.append("Escribe un título.")
        if not question:
            errors.append("Escribe una descripción.")
        if not isinstance(cards, list) or not 3 <= len(cards) <= 15:
            errors.append("Añade entre 3 y 15 tarjetas.")
            cards = []
        cleaned_cards = [{"front": str(card.get("front", "")).strip()[:500], "back": str(card.get("back", "")).strip()[:500]} for card in cards if isinstance(card, dict) and str(card.get("front", "")).strip() and str(card.get("back", "")).strip()]
        if len(cleaned_cards) != len(cards):
            errors.append("Cada tarjeta debe tener anverso y reverso.")
        if errors:
            return None, errors
        return {"type": activity_type, "title": title[:200], "question": question[:2000], "cards": cleaned_cards, "answers": [], "language": language, **metadata}, []
    if activity_type == "crossword":
        words = payload.get("words")
        if not title:
            errors.append("Escribe un título.")
        if not question:
            errors.append("Escribe una descripción.")
        if not isinstance(words, list) or not 4 <= len(words) <= 10:
            errors.append("Añade entre 4 y 10 palabras con sus pistas.")
            words = []
        cleaned_words = []
        for word in words:
            answer = str(word.get("answer", "")).strip().lower() if isinstance(word, dict) else ""
            clue = str(word.get("clue", "")).strip()[:300] if isinstance(word, dict) else ""
            if answer and clue and re.fullmatch(r"[a-záéíóúüñ]+", answer):
                cleaned_words.append({"answer": answer[:20], "clue": clue})
        if len(cleaned_words) != len(words):
            errors.append("Cada palabra debe tener una pista y solo contener letras.")
        if len({word["answer"] for word in cleaned_words}) != len(cleaned_words):
            errors.append("No repitas palabras.")
        if errors:
            return None, errors
        return {"type": activity_type, "title": title[:200], "question": question[:2000], "words": cleaned_words, "answers": [], "language": language, **metadata}, []
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
    catalog = read_catalog()
    subject = str(payload.get("subject", "")).strip()[:120]
    educational_stage = str(payload.get("educational_stage", "")).strip()[:120]
    level = str(payload.get("educational_level", "")).strip()[:120]
    if PLAY_CONTROLLED_CATALOG:
        for field, value, catalog_key in (("subject", subject, "subjects"), ("educational_stage", educational_stage, "educational_stages"), ("educational_level", level, "levels")):
            if value and value.lower() not in catalog[catalog_key]:
                errors.append(f"Valor no disponible en el catálogo: {field}.")
    metadata = {
        "description": str(payload.get("description", "")).strip()[:2000],
        "subject": subject,
        "educational_stage": educational_stage,
        "educational_level": level,
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
    if PLAY_CONTROLLED_CATALOG:
        unknown_tags = [tag for tag in metadata["tags"] if tag.lower() not in catalog["tags"]]
        if unknown_tags:
            errors.append("Hay etiquetas que no están disponibles en el catálogo.")
    return metadata, errors


def read_catalog() -> dict[str, list[str]]:
    file = DATA_DIR / "catalog.json"
    try:
        value = json.loads(file.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        value = CATALOG_DEFAULTS
    if isinstance(value, dict) and isinstance(value.get("values"), dict):
        value = value["values"]
    return {key: sorted(set(str(item).strip().lower() for item in value.get(key, []) if str(item).strip())) for key in CATALOG_DEFAULTS}


def read_catalog_labels() -> dict[str, dict[str, str]]:
    file = DATA_DIR / "catalog.json"
    try:
        value = json.loads(file.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return CATALOG_LABELS_DEFAULT
    labels = value.get("labels", {}) if isinstance(value, dict) else {}
    return labels if isinstance(labels, dict) else CATALOG_LABELS_DEFAULT


def save_catalog(value: dict) -> dict[str, list[str]]:
    catalog = {key: sorted(set(str(item).strip().lower() for item in value.get(key, []) if str(item).strip()))[:200] for key in CATALOG_DEFAULTS}
    labels = value.get("labels", {})
    if not isinstance(labels, dict):
        labels = {}
    labels = {str(key): {str(language): str(label).strip()[:120] for language, label in item.items() if language in LANGUAGES and str(label).strip()} for key, item in labels.items() if isinstance(item, dict)}
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    (DATA_DIR / "catalog.json").write_text(json.dumps({"values": catalog, "labels": labels}, ensure_ascii=False, indent=2), encoding="utf-8")
    return {**catalog, "labels": labels}


class Handler(BaseHTTPRequestHandler):
    server_version = "EduTicTacPlay/0.1"

    def identity_id(self) -> str:
        """Return the identity supplied by a configured trusted auth adapter."""

        if not PLAY_TRUSTED_IDENTITY_HEADER:
            return ""
        value = self.headers.get(PLAY_TRUSTED_IDENTITY_HEADER, "").strip()
        return value[:160] if re.fullmatch(r"[A-Za-z0-9._:@/-]{1,160}", value) else ""

    def can_access_activity(self, activity: dict) -> bool:
        visibility = activity.get("visibility", "public")
        if visibility == "public":
            return True
        identity = self.identity_id()
        return bool(identity and activity.get("owner_id") == identity)

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
        if path == "/api/catalog":
            self.send_json(HTTPStatus.OK, {**read_catalog(), "labels": read_catalog_labels()})
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
            filters["identity_id"] = self.identity_id()
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
            if activity and self.can_access_activity(activity):
                self.send_json(HTTPStatus.OK, activity)
            else:
                self.send_json(HTTPStatus.NOT_FOUND, {"error": "Actividad no encontrada."})
            return
        match = re.fullmatch(rf"/api/activities/({ACTIVITY_ID_PATTERN})/download", path)
        if match:
            activity = read_activity(match.group(1))
            if not activity or not self.can_access_activity(activity):
                self.send_json(HTTPStatus.NOT_FOUND, {"error": "Actividad no encontrada."})
                return
            self.download_package(activity)
            return
        match = re.fullmatch(rf"/api/activities/({ACTIVITY_ID_PATTERN})/h5p/(.+)", path)
        if match:
            activity = read_activity(match.group(1))
            if not activity or not self.can_access_activity(activity):
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
        if route == "/api/catalog":
            self.update_catalog()
            return
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
        requested_visibility = str(payload.get("visibility", PLAY_DEFAULT_VISIBILITY)).strip().lower()
        if requested_visibility not in VISIBILITIES:
            self.send_json(HTTPStatus.UNPROCESSABLE_ENTITY, {"errors": ["Visibilidad no válida."]})
            return
        identity = self.identity_id()
        activity["visibility"] = requested_visibility if identity else "public"
        if identity:
            activity["owner_id"] = identity
        activity["createdAt"] = __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat()
        save_activity(activity)
        self.send_json(HTTPStatus.CREATED, activity)

    def update_catalog(self) -> None:
        if not self.admin_authorized():
            self.send_json(HTTPStatus.FORBIDDEN, {"error": "Catálogo no autorizado."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 32 * 1024:
                raise ValueError("El catálogo es demasiado grande.")
            payload = json.loads(self.rfile.read(length))
            if not isinstance(payload, dict):
                raise ValueError("El catálogo no es válido.")
            catalog = save_catalog(payload)
        except (ValueError, json.JSONDecodeError):
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": "Catálogo no válido."})
            return
        self.send_json(HTTPStatus.OK, catalog)

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
    identity = filters.get("identity_id", "")
    if activity.get("visibility", "public") != "public" and activity.get("owner_id") != identity:
        return False
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
        "educational_level": activity.get("educational_level", ""),
        "license": activity.get("license", ""),
        "author_pseudonym": activity.get("author_pseudonym", ""),
        "tags": activity.get("tags", []),
        "visibility": activity.get("visibility", "public"),
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
