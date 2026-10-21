"""Paquet intern de l'EduTicTac ID API.

`create_app()` munta l'aplicació a partir d'una configuració explícita. Els
routers no guarden estat de mòdul: tot el que depén de l'entorn viu en el
context `Commons`, accessible des de cada petició.
"""

from .app import create_app
from .settings import Settings

__all__ = ["Settings", "create_app"]
