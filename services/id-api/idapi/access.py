"""Regla SQL única: un docent pot treballar amb una aula si n'és propietari o col·laborador."""

from __future__ import annotations


def member_of(group_ref: str, owner_ref: str = "g.created_by_teacher_id") -> str:
    """Condició SQL que espera `teacher_params(teacher_id)` com a paràmetres.

    `group_ref` és la columna amb l'identificador de l'aula. `owner_ref` és la
    columna que identifica el propietari; per a les assignacions continua sent
    qui la va crear (vegeu `tests/test_group_access_matrix.py`).
    """
    return (
        f"({owner_ref} = ? OR EXISTS ("
        f"SELECT 1 FROM group_memberships m WHERE m.group_id = {group_ref} AND m.teacher_id = ?))"
    )


def teacher_params(teacher_id: str) -> tuple[str, str]:
    return (teacher_id, teacher_id)
