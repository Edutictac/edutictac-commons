"""Bancos de recursos libres consultados desde el servidor de Commons.

La lógica (proveedores, red segura, saneado de SVG, firmas) vive en el paquete compartido `edutictac-banks`,
copiado en `assets/edutictac_banks/` con `scripts/sync-banks.sh`; no se edita aquí. Este módulo solo lo expone al Rebost."""
from .edutictac_banks import Banks, BankError  # noqa: F401
