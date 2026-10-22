"""Validació i normalització de les activitats que envia l'editor."""

from __future__ import annotations

import re

from .catalog import read_catalog
from .config import PLAY_CONTROLLED_CATALOG
from .h5p import COMPOUND_CHILD_TYPES, activity_language, valid_matching_image
from .store import ID_RE

VISIBILITIES = {"private", "class", "public"}

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
        cleaned = []
        for card in cards:
            if not isinstance(card, dict) or not str(card.get("text", "")).strip():
                continue
            item = {"text": str(card.get("text", "")).strip()[:120]}
            image = str(card.get("image", "") or "").strip()
            if image:
                if not valid_matching_image(image):
                    errors.append("Las imágenes deben estar optimizadas en formato WebP y pesar menos de 400 KB.")
                else:
                    item["image"] = image
            cleaned.append(item)
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
        cleaned = []
        for pair in pairs:
            if not isinstance(pair, dict) or not str(pair.get("left", "")).strip() or not str(pair.get("right", "")).strip():
                continue
            item = {"left": str(pair.get("left", "")).strip()[:120], "right": str(pair.get("right", "")).strip()[:120]}
            for side in ("left", "right"):
                image = str(pair.get(f"{side}Image", "") or "").strip()
                if image:
                    if not valid_matching_image(image):
                        errors.append("Las imágenes deben estar optimizadas en formato WebP y pesar menos de 400 KB.")
                    else:
                        item[f"{side}Image"] = image
            cleaned.append(item)
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
            cleaned_item = {"text": str(item["text"]).strip()[:120], "category": category}
            image = str(item.get("image", "") or "").strip()
            if image:
                if not valid_matching_image(image):
                    errors.append("Las imágenes deben estar optimizadas en formato WebP y pesar menos de 400 KB.")
                else:
                    cleaned_item["image"] = image
            cleaned_items.append(cleaned_item)
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
