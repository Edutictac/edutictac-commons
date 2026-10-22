"""Catàleg controlat d'àrees, etapes, nivells i etiquetes."""

from __future__ import annotations

import json

from .config import DATA_DIR
from .h5p import LANGUAGES

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
    "repaso": {"es": "Repaso", "ca": "Repàs", "en": "Revision"},
    "vocabulario": {"es": "Vocabulario", "ca": "Vocabulari", "en": "Vocabulary"},
    "comprension": {"es": "Comprensión", "ca": "Comprensió", "en": "Comprehension"},
    "calculo": {"es": "Cálculo", "ca": "Càlcul", "en": "Calculation"},
    "creatividad": {"es": "Creatividad", "ca": "Creativitat", "en": "Creativity"},
    "investigacion": {"es": "Investigación", "ca": "Investigació", "en": "Research"},
}

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
