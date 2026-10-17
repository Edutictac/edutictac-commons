#!/usr/bin/env python3
"""Serve only Portal/Admin static assets for isolated browser checks."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT / "services/portal/public"), **kwargs)

    def translate_path(self, path):
        current = self.directory
        try:
            parsed = urlsplit(path)
            if parsed.path == "/admin" or parsed.path.startswith("/admin/"):
                self.directory = str(ROOT / "admin/public")
                path = parsed.path[len("/admin"):] or "/"
            return super().translate_path(path)
        finally:
            self.directory = current

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", 18082), Handler).serve_forever()
