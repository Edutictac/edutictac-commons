"""Construcció dels paquets H5P i textos de les interfícies per idioma."""

from __future__ import annotations

import html
import json
import uuid
from pathlib import Path

from .config import LIBRARIES_DIR, MAX_MATCHING_IMAGE_BYTES

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

def matching_side_markup(pair: dict, side: str) -> str:
    text = safe_text(pair.get(side, ""), 120)
    image = str(pair.get(f"{side}Image", "") or "")
    if not valid_matching_image(image):
        return text
    return f'<img src="{html.escape(image, quote=True)}" alt="{text}" style="max-width:100%;max-height:96px;display:block;margin:auto"><span>{text}</span>'


def matching_item_markup(item: dict) -> str:
    text = safe_text(item.get("text", ""), 120)
    image = str(item.get("image", "") or "")
    if not valid_matching_image(image):
        return text
    return f'<img src="{html.escape(image, quote=True)}" alt="{text}" style="max-width:100%;max-height:96px;display:block;margin:auto"><span>{text}</span>'


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


def valid_matching_image(value: str) -> bool:
    """Accept only client/server-optimized WebP data URLs below the cap."""

    prefix = "data:image/webp;base64,"
    if not value.startswith(prefix):
        return False
    encoded = value[len(prefix):]
    if len(encoded) > ((MAX_MATCHING_IMAGE_BYTES + 2) * 4 // 3 + 8):
        return False
    try:
        import base64

        decoded = base64.b64decode(encoded, validate=True)
    except (ValueError, TypeError):
        return False
    return 1 <= len(decoded) <= MAX_MATCHING_IMAGE_BYTES


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
            elements.append({"type": {"library": "H5P.AdvancedText 1.1", "params": {"text": f"<p>{matching_item_markup(item)}</p>"}}, "x": 5 + (index % 3) * 30, "y": 6 + (index // 3) * 12, "height": 8 if item.get("image") else 5, "width": 24, "dropZones": [int(item["category"])], "backgroundOpacity": 100, "multiple": False})
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
            elements.append({"type": {"library": "H5P.AdvancedText 1.1", "params": {"text": f"<p>{matching_side_markup(pair, 'left')}</p>"}}, "x": 5, "y": top, "height": 8 if pair.get("leftImage") else 3, "width": 20, "dropZones": [index], "backgroundOpacity": 100, "multiple": False})
            drop_zones.append({"label": matching_side_markup(pair, "right"), "showLabel": True, "x": 55, "y": top, "height": 8 if pair.get("rightImage") else 3, "width": 25, "correctElements": [index], "backgroundOpacity": 100, "tipsAndFeedback": {"tip": "", "feedbackOnCorrect": t["correct"], "feedbackOnIncorrect": t["incorrect"]}})
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
                {"image": {"path": f"card-{index}.{'webp' if card.get('image') else 'svg'}", "mime": "image/webp" if card.get("image") else "image/svg+xml", "width": 320, "height": 180}, "imageAlt": safe_text(card["text"])}
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
            if card.get("image"):
                import base64

                files[f"content/card-{index}.webp"] = base64.b64decode(card["image"].split(",", 1)[1])
                continue
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

def content_type_for(path: Path) -> str:
    return {
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".svg": "image/svg+xml",
        ".webp": "image/webp",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".ttf": "font/ttf",
        ".eot": "application/vnd.ms-fontobject",
    }.get(path.suffix, "application/octet-stream")
