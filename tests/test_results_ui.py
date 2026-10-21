"""Teacher results against temporary SQLite; no installed accounts or data."""
import pytest
from test_credentials_ui import api, live_teacher


def seed(module):
    with module.get_conn() as conn:
        for identity, group in [('pupil:one', 'group'), ('outsider', 'other')]:
            conn.execute("INSERT INTO student_identities (id, group_id, public_code, pin_hash, created_at, updated_at) VALUES (?, ?, ?, 'unused', '2026-10-21', '2026-10-21')", (identity, group, identity))
        conn.execute("INSERT INTO scores (id, identity_id, assignment_id, app_id, activity_id, score, created_at) VALUES ('score', 'pupil:one', 'a', 'play', 'a', 88, '2026-10-21')")
        conn.execute("UPDATE activity_assignments SET created_by_teacher_id='other-teacher' WHERE id='foreign'")


def test_results_authorization_and_manual_marks(api, monkeypatch):
    client, module, _ = api
    seed(module)
    path = '/api/teacher/activity-assignments/b'
    assert client.post(path + '/students/outsider/complete').status_code == 404
    assert client.get('/api/teacher/activity-assignments/foreign/results').status_code == 404
    monkeypatch.setattr(module.commons.auth, 'require_teacher', lambda request: 'collaborator')
    assert client.get(path + '/results').status_code == 404
    with module.get_conn() as conn:
        conn.execute("INSERT INTO group_memberships VALUES ('group', 'collaborator', 'teacher', '2026-10-21')")
    assert client.get(path + '/results').status_code == 200
    assert client.post(path + '/students/pupil%3Aone/complete').status_code == 201
    assert client.get(path + '/results').json()['results'][0]['completed'] is True
    with module.get_conn() as conn:
        conn.execute("DELETE FROM group_memberships WHERE teacher_id='collaborator'")
    assert client.delete(path + '/students/pupil%3Aone/complete').status_code == 404
    assert client.get(path + '/results').status_code == 404


@pytest.mark.parametrize('language,touch', [('es', False), ('va', True)])
def test_results_vue_real_api_preserves_scores(live_teacher, language, touch):
    playwright = pytest.importorskip('playwright.sync_api')
    client, module, address = live_teacher
    seed(module)
    with playwright.sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        context = browser.new_context(extra_http_headers={'Authorization': 'Bearer test-only-teacher'}, has_touch=touch, viewport={'width':1024, 'height':1000})
        context.add_init_script(f"localStorage.setItem('edutictac-portal-lang','{language}');localStorage.setItem('edutictac-commons-state',JSON.stringify({{group:{{id:'group',group_code:'group'}}}}))")
        page = context.new_page(); errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.route('**/*', lambda route: route.continue_() if route.request.url.startswith(address + '/') else route.abort())
        page.goto(address + '/teacher.html')
        page.locator('#oidcSetupDialog button[type=submit]').click()
        page.locator('[data-select-assignment=b]').click()
        page.locator('details').filter(has=page.locator('#resultsPanel')).locator('summary').click()
        page.locator('#loadResults').click()
        playwright.expect(page.locator('[data-mark-completed]')).to_be_enabled()
        page.locator('[data-mark-completed]').click()
        playwright.expect(page.locator('[data-unmark-completed]')).to_be_enabled()
        with module.get_conn() as conn:
            assert conn.execute("SELECT COUNT(*) FROM manual_completions WHERE assignment_id='b'").fetchone()[0] == 1
        page.locator('[data-unmark-completed]').click()
        playwright.expect(page.locator('[data-mark-completed]')).to_be_enabled()
        with module.get_conn() as conn:
            assert conn.execute("SELECT COUNT(*) FROM manual_completions WHERE assignment_id='b'").fetchone()[0] == 0
        page.locator('[data-select-assignment=a]').click()
        page.locator('#loadResults').click()
        playwright.expect(page.locator('#resultsOutput tbody tr')).to_contain_text('88')
        page.locator('[data-unmark-completed]').click()
        # Automatic completion by a score cannot be erased with the manual toggle.
        playwright.expect(page.locator('[data-unmark-completed]')).to_be_enabled()
        page.locator('#loadRanking').click()
        playwright.expect(page.locator('#resultsOutput tbody tr')).to_contain_text('88')
        with module.get_conn() as conn:
            assert conn.execute("SELECT score FROM scores WHERE id='score'").fetchone()[0] == 88
        assert not errors
        context.close(); browser.close()
