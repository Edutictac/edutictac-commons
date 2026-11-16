import html
import re
import unicodedata

UUID = re.compile(r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")
LANGUAGES = {"es": "es", "ca": "ca", "va": "ca", "en": "en"}
NON_FREE = re.compile(r"(?<![A-Za-z])(?:nc|nd)(?![A-Za-z])|non[- ]?commercial|no derivatives", re.I)


def plain(value) -> str:
    """Texto sin etiquetas HTML ni entidades, con espacios normalizados."""
    text = html.unescape(re.sub(r"<[^>]+>", " ", str(value or "")))
    return re.sub(r"\s+", " ", text).strip()


def fold(text: str) -> str:
    """Minúsculas sin tildes ni espacios repetidos (para comparar palabras en castellano y valenciano)."""
    base = unicodedata.normalize("NFKD", (text or "").strip().lower())
    return re.sub(r"\s+", " ", "".join(c for c in base if not unicodedata.combining(c)))


def language(value: str) -> str:
    return LANGUAGES.get((value or "").strip().lower(), "es")


def clean_query(query: str) -> str:
    """Consulta de 1 a 80 caracteres; si no, error `bank_query` (422)."""
    from .errors import BankError
    text = (query or "").strip()
    if not text or len(text) > 80:
        raise BankError(422, "bank_query")
    return text
