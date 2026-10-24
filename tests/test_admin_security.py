"""Helpers d'origen i autoritzacio del panell admin."""

import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).parents[1]
sys.path.insert(0, str(ROOT / "admin"))
SPEC = importlib.util.spec_from_file_location("admin_security_test", ROOT / "admin/server.py")
admin = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(admin)


def test_same_origin_request():
    assert admin.same_origin_request({"Host": "commons.centre:8082"}) is True
    assert admin.same_origin_request({
        "Host": "commons.centre:8082", "Origin": "http://commons.centre:8082"}) is True
    assert admin.same_origin_request({
        "Host": "commons.centre:8082", "Origin": "https://commons.centre:8082"}) is False
    assert admin.same_origin_request({
        "Host": "commons.centre:8082", "Origin": "https://commons.centre:8082",
        "X-Forwarded-Proto": "https"}) is True
    assert admin.same_origin_request({
        "Host": "commons.centre:8082", "Origin": "https://pages.centre:8082"}) is False
    assert admin.same_origin_request({
        "Host": "commons.centre:8082", "Origin": "null"}) is False
    assert admin.same_origin_request({
        "Host": "commons.centre:8082", "Sec-Fetch-Site": "cross-site"}) is False


def test_admin_post_requires_json():
    assert admin.admin_post_allowed({"Host": "commons.centre", "Content-Type": "application/json"}) is True
    assert admin.admin_post_allowed({"Host": "commons.centre", "Content-Type": "application/json; charset=utf-8"}) is True
    assert admin.admin_post_allowed({"Host": "commons.centre", "Content-Type": "text/plain"}) is False
    assert admin.admin_post_allowed({"Host": "commons.centre"}) is False


def test_identity_is_admin_accepts_username_or_role():
    assert admin.identity_is_admin({"provider": "authentik", "username": "akadmin"}) is True
    assert admin.identity_is_admin({"provider": "authentik", "username": "direccio", "role": "administrador"}) is True
    assert admin.identity_is_admin({"provider": "authentik", "username": "teacher", "role": "profesor"}) is False
    assert admin.identity_is_admin({"provider": "local", "username": "akadmin", "role": "administrador"}) is False
