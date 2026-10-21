"""Real assignment persistence and permissions; mock only the separate catalogue."""
import pytest
from test_credentials_ui import api, live_teacher


def test_assignments_remain_scoped_to_authorized_classrooms(api, monkeypatch):
    client, module, _ = api
    payload = {'group_id':'group', 'app_id':'resource', 'activity_id':'teacher-upload:document', 'title':'Document', 'launch_url':'http://example.test/documents/document'}
    assert client.post('/api/teacher/activity-assignments', json={**payload, 'group_id':'other'}).status_code == 404
    monkeypatch.setattr(module.commons.auth, 'require_teacher', lambda request: 'collaborator')
    assert client.post('/api/teacher/activity-assignments', json=payload).status_code == 404
    with module.get_conn() as conn:
        conn.execute("INSERT INTO group_memberships VALUES ('group', 'collaborator', 'teacher', '2026-10-21')")
    result = client.post('/api/teacher/activity-assignments', json=payload)
    assert result.status_code == 201
    with module.get_conn() as conn:
        conn.execute("DELETE FROM group_memberships WHERE teacher_id='collaborator'")
    assert client.post('/api/teacher/activity-assignments', json=payload).status_code == 404
    with module.get_conn() as conn:
        assert conn.execute("SELECT group_id FROM activity_assignments WHERE id=?", (result.json()['assignment']['id'],)).fetchone()[0] == 'group'


@pytest.mark.parametrize('language,touch', [('es',False), ('va',True)])
def test_resources_vue_assigns_and_reopens_with_real_api(live_teacher, monkeypatch, language, touch):
    monkeypatch.setenv('COMMONS_MODULE_PROFILES', 'play,recursos')
    playwright = pytest.importorskip('playwright.sync_api')
    client, module, address = live_teacher
    items = [
        {'external_id':'edutictac-play:game', 'provider':'edutictac-play', 'title':'Synthetic game', 'play_url':'/play/game'},
        {'external_id':'teacher-upload:document', 'provider':'teacher-upload', 'title':'Synthetic document', 'download_url':'/documents/document'},
    ]
    with playwright.sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        context = browser.new_context(extra_http_headers={'Authorization':'Bearer test-only-teacher'}, has_touch=touch, viewport={'width':1024,'height':1000})
        context.add_init_script(f"localStorage.setItem('edutictac-portal-lang','{language}');if(!localStorage.getItem('edutictac-commons-state'))localStorage.setItem('edutictac-commons-state',JSON.stringify({{group:{{id:'group',group_code:'group'}}}}))")
        page = context.new_page(); errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.route('**/*', lambda route: route.continue_() if route.request.url.startswith(address + '/') else route.abort())
        page.route('**/resources-api/**', lambda route: route.fulfill(json={'items':items}))
        page.goto(address + '/teacher.html')
        page.locator('#oidcSetupDialog button[type=submit]').click()
        page.locator('details').filter(has=page.locator('#resourcesPanel')).locator('summary').click()
        page.locator('#loadFavoriteResources').click()
        playwright.expect(page.locator('#assignFavoriteResources')).to_be_enabled()
        page.locator('#assignFavoriteResources').click()
        playwright.expect(page.locator('#resourcesOutput')).to_contain_text('2 recursos')
        playwright.expect(page.locator('#loadFavoriteResources')).to_be_enabled()
        with module.get_conn() as conn:
            rows = conn.execute("SELECT app_id, activity_id, group_id FROM activity_assignments WHERE title LIKE 'Synthetic%' ORDER BY app_id").fetchall()
            assert [tuple(row) for row in rows] == [('edutictac-play','game','group'),('resource','teacher-upload:document','group')]
        page.reload(); page.locator('#oidcSetupDialog button[type=submit]').click()
        playwright.expect(page.locator('#teacherOutput')).to_contain_text('Synthetic document')
        selected = page.locator('#teacherOutput [aria-pressed=true]')
        playwright.expect(selected).to_have_count(1)
        # Only synthetic metadata is visible; there are no generated PIN cards.
        page.locator('details').filter(has=page.locator('#resourcesPanel')).locator('summary').click()
        page.locator('#searchResources').click()
        playwright.expect(page.locator('[data-assign-resource]')).to_have_count(2)
        page.screenshot(path=f'/tmp/commons-resources-vue-{language}.png', full_page=True)
        assert not errors
        context.close(); browser.close()
