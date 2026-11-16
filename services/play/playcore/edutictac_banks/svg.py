"""Saneado de SVG por lista blanca: solo formas y degradados, sin scripts, estilos, enlaces ni referencias externas."""
import re
import xml.etree.ElementTree as ET

from .errors import BankError

MAX_SVG = 300 * 1024
SVG_NS = "http://www.w3.org/2000/svg"
SVG_TAGS = {"svg", "g", "path", "circle", "ellipse", "rect", "line", "polyline", "polygon", "defs", "clipPath", "mask",
            "linearGradient", "radialGradient", "stop", "title", "desc"}
SVG_ATTRS = {"xmlns", "viewBox", "width", "height", "d", "fill", "stroke", "stroke-width", "stroke-linecap",
             "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "fill-opacity", "fill-rule", "clip-rule", "opacity",
             "transform", "cx", "cy", "r", "rx", "ry", "x", "y", "x1", "y1", "x2", "y2", "points", "id", "clip-path", "mask",
             "offset", "stop-color", "stop-opacity", "gradientUnits", "gradientTransform", "clipPathUnits", "maskUnits",
             "preserveAspectRatio", "color", "role", "aria-hidden", "focusable", "vector-effect"}


def sanitize_svg(data: bytes) -> bytes:
    """SVG de llista blanca: només formes i degradats, sense scripts, estils, enllaços ni referències externes."""
    if len(data) > MAX_SVG or b"<!" in data.replace(b"<!--", b"")[:4096] or b"<?xml-stylesheet" in data:
        raise BankError(502, "bank_invalid_image")
    try:
        root = ET.fromstring(data)
    except ET.ParseError as exc:
        raise BankError(502, "bank_invalid_image") from exc

    def clean(node, top=False):
        tag = node.tag.split("}", 1)[-1] if isinstance(node.tag, str) else ""
        if tag not in SVG_TAGS or (node.tag.startswith("{") and not node.tag.startswith("{" + SVG_NS + "}")):
            raise BankError(502, "bank_invalid_image")
        if top and tag != "svg":
            raise BankError(502, "bank_invalid_image")
        for name, value in list(node.attrib.items()):
            local = name.split("}", 1)[-1]
            lowered = value.lower()
            if (name.startswith("{") and local not in ("space",)) or local not in SVG_ATTRS or local.lower().startswith("on"):
                raise BankError(502, "bank_invalid_image")
            if "javascript:" in lowered or "data:" in lowered or ("url(" in lowered and not re.fullmatch(r"url\(#[\w.-]+\)", value.strip())):
                raise BankError(502, "bank_invalid_image")
        if node.text and node.text.strip() and tag not in ("title", "desc"):
            raise BankError(502, "bank_invalid_image")
        for child in list(node):
            clean(child)

    clean(root, top=True)
    ET.register_namespace("", SVG_NS)
    return ET.tostring(root, encoding="utf-8", xml_declaration=False)
