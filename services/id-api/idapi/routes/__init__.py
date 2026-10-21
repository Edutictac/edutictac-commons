"""Routers propis de l'ID API, en l'ordre en què es munten."""

from . import apps, assignments, groups, itineraries, sessions, student, system

ROUTERS = [
    system.router,
    sessions.router,
    groups.router,
    student.router,
    assignments.router,
    itineraries.router,
    apps.router,
]
