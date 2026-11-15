"""EduTicTac Banks: motores compartidos de bancos de recursos libres (MIT)."""
from .banks import (ARASAAC, ICONS, MET, OPENVERSE, OPENVERSE_AUDIO, PROVIDERS, WIKIMEDIA, Banks, english_terms,
                    icon_terms, sound_host_ok)
from .errors import BankError
from .net import check_url, get_json, safe_get
from .sniff import image_type, sniff_sound
from .svg import sanitize_svg
from .text import fold, language, plain

__all__ = ["ARASAAC", "ICONS", "MET", "OPENVERSE", "OPENVERSE_AUDIO", "PROVIDERS", "WIKIMEDIA", "Banks", "BankError",
           "check_url", "english_terms", "fold", "get_json", "icon_terms", "image_type", "language", "plain",
           "safe_get", "sanitize_svg", "sniff_sound", "sound_host_ok"]
__version__ = "0.1.0"
