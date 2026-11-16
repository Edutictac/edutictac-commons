from .errors import BankError


def image_type(data: bytes) -> str:
    """PNG, JPEG o WebP por firma; cualquier otra cosa es un error."""
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if data.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    raise BankError(502, "bank_invalid_image")


def sniff_sound(data: bytes) -> str:
    """OGG, MP3 o WAV por firma."""
    if data[:4] == b"OggS":
        return "audio/ogg"
    if data[:3] == b"ID3" or (len(data) > 1 and data[0] == 0xFF and data[1] & 0xE0 == 0xE0):
        return "audio/mpeg"
    if data[:4] == b"RIFF" and data[8:12] == b"WAVE":
        return "audio/wav"
    raise BankError(502, "bank_invalid_audio")
