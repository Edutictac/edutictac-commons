"""Efectes de so CC0 inclosos amb l'API: col·lecció de només lectura «effects».

Codi original de Commons (MIT). Els sons conserven la seua llicència pròpia
(CC0 1.0, Kenney). Cada fitxer es verifica contra la suma SHA-256 del manifest.
"""
import hashlib
import json
import re
from pathlib import Path

from .catalogue import canonical


def load(folder):
    """Retorna (items, total_bytes) amb el mateix format que Catalogue.items."""
    folder = Path(folder).resolve()
    raw = (folder / "manifest.json").read_bytes()
    manifest = json.loads(raw)
    if (manifest.get("format") != "rebost-sounds" or manifest.get("version") != 1
            or not isinstance(manifest.get("items"), list) or len(manifest["items"]) > 500):
        raise ValueError("Invalid sound manifest")

    def read(relative, prefix, suffix, maximum, digest):
        parts = Path(relative).parts
        if len(parts) != 2 or parts[0] != prefix or not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]*" + re.escape(suffix), parts[1]):
            raise ValueError("Invalid sound path")
        target = folder / relative
        if any((folder / Path(*parts[:i])).is_symlink() for i in range(1, 3)) or not target.resolve().is_relative_to(folder) or not target.is_file():
            raise ValueError("Invalid sound file")
        if target.stat().st_size > maximum:
            raise ValueError("Sound file too large")
        data = target.read_bytes()
        if hashlib.sha256(data).hexdigest() != digest:
            raise ValueError("Sound checksum mismatch")
        return data

    licence = manifest["license_file"]
    license_text = read(licence["path"], "licenses", ".txt", 65536, licence["sha256"]).decode("utf-8")
    items, total = {}, len(raw) + len(license_text.encode())
    for record in manifest["items"]:
        source_id = record["source_id"]
        asset_id = "img-" + hashlib.sha256(source_id.encode()).hexdigest()
        if not re.fullmatch(r"kenney:[a-z0-9-]{1,100}", source_id) or asset_id in items:
            raise ValueError("Invalid or duplicate sound id")
        data = read(record["path"], "sounds", ".ogg", 512 * 1024, record["sha256"])
        if data[:4] != b"OggS":
            raise ValueError("Invalid sound format")
        public = {"id": asset_id, "name": record["name"], "names": record["names"],
                  "aliases": record["aliases"], "type": "sound", "width": 0, "height": 0,
                  "collection": "effects", "readonly": True, "bytes": len(data),
                  "license": manifest["license"], "attribution": manifest["attribution"],
                  "source_id": source_id, "pack": record["pack"], "category": record["category"],
                  "duration_ms": record["duration_ms"]}
        public["revision"] = int(hashlib.sha256(canonical(public)).hexdigest()[:12], 16)
        items[asset_id] = {"metadata": public, "data": data, "thumbnail": b"",
                           "provenance": (canonical(public).decode(), b"", license_text)}
        total += len(data)
    return items, total
