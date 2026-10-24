"""SQLite busy timeout for concurrent classroom writes."""

import importlib.util
from pathlib import Path
import sys

ROOT = Path(__file__).parents[1]
sys.path.insert(0, str(ROOT / 'services/id-api/vendor'))
SPEC = importlib.util.spec_from_file_location('community_db_test', ROOT / 'services/id-api/vendor/edutictac_community/db.py')
db = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(db)


def test_busy_timeout_default_and_override(tmp_path, monkeypatch):
    monkeypatch.delenv('EDUTICTAC_SQLITE_BUSY_TIMEOUT_MS', raising=False)
    with db.connect(str(tmp_path / 'id.db')) as conn:
        assert conn.execute('PRAGMA busy_timeout').fetchone()[0] == 5000

    monkeypatch.setenv('EDUTICTAC_SQLITE_BUSY_TIMEOUT_MS', '1234')
    with db.connect(str(tmp_path / 'id.db')) as conn:
        assert conn.execute('PRAGMA busy_timeout').fetchone()[0] == 1234

    monkeypatch.setenv('EDUTICTAC_SQLITE_BUSY_TIMEOUT_MS', '999999')
    with db.connect(str(tmp_path / 'id.db')) as conn:
        assert conn.execute('PRAGMA busy_timeout').fetchone()[0] == 60000
