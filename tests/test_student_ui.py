"""Pupil Vue flows with real cookies, API and disposable SQLite only.

Generated credentials stay in memory; never log or screenshot the PIN fields.
"""
import pytest
from test_credentials_ui import api, live_teacher


@pytest.mark.parametrize('language,touch', [('es', False), ('va', True)])
def test_student_code_pin_progress_profile_launch_and_revoke(live_teacher, monkeypatch, language, touch):
    playwright = pytest.importorskip('playwright.sync_api')
    client, module, address = live_teacher
    monkeypatch.setenv('COMMONS_MODULE_PROFILES', 'play,recursos')
    batch = client.post('/api/identities/batch', json={'tenant_id':'test', 'count':1, 'pin_length':4}).json()
    pupil, group = batch['identities'][0], batch['group']
    body = {'group_id':group['id'], 'app_id':'resource', 'activity_id':'synthetic', 'title':'Reading', 'launch_url':address + '/synthetic-resource'}
    first = client.post('/api/teacher/activity-assignments', json=body).json()['assignment']
    second = client.post('/api/teacher/activity-assignments', json={**body, 'activity_id':'next', 'title':'Next story'}).json()['assignment']
    itinerary = client.post('/api/teacher/itineraries', json={'group_id':group['id'], 'title':'Stories'}).json()['itinerary']
    url = '/api/teacher/itineraries/' + itinerary['id'] + '/items'
    assert client.put(url, json={'assignment_ids':[second['id'],first['id']], 'expected_assignment_ids':[]}).status_code == 200
    with module.get_conn() as conn:
        conn.execute("INSERT INTO scores (id, identity_id, assignment_id, app_id, activity_id, score, created_at) VALUES ('student-score', ?, ?, 'resource', 'synthetic', 0, '2026-10-21')", (pupil['id'],first['id']))
    with playwright.sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        context = browser.new_context(has_touch=touch, viewport={'width':1024,'height':1000})
        context.add_init_script(f"localStorage.setItem('edutictac-portal-lang','{language}')")
        context.route('**/*', lambda route: route.continue_() if route.request.url.startswith(address + '/') else route.abort())
        context.route('**/synthetic-resource', lambda route: route.fulfill(content_type='text/html',body='<p>Synthetic resource</p>'))
        page = context.new_page(); errors=[]
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(address + '/student.html')
        playwright.expect(page.locator('#studentLogin')).to_be_enabled()
        page.locator('#studentCode').fill(pupil['public_code'].lower())
        page.locator('#studentPin').fill(pupil['pin'])
        page.locator('#studentPin').press('Enter')
        playwright.expect(page.locator('.student-profile')).to_contain_text(pupil['public_code'])
        playwright.expect(page.locator('#studentPin')).to_have_value('')
        playwright.expect(page.locator('[data-student-itinerary]')).to_contain_text('Stories')
        playwright.expect(page.locator('#studentOutput')).to_contain_text('1/2')
        playwright.expect(page.locator('tbody tr')).to_have_count(1)
        page.locator('[data-student-icon="🦊"]').click()
        playwright.expect(page.locator('[data-student-icon="🦊"]')).to_have_attribute('aria-pressed','true')
        page.reload()
        playwright.expect(page.locator('[data-student-icon="🦊"]')).to_have_attribute('aria-pressed','true')
        page.locator('[data-toggle-student-history]').click()
        playwright.expect(page.locator('tbody tr')).to_have_count(2)
        assert page.locator('tbody tr').first.locator('td').first.inner_text() == 'Next story'
        playwright.expect(page.locator('tbody tr').nth(1).locator('td').nth(2)).to_have_text('0')
        with context.expect_page() as opened:
            page.locator('[data-launch-resource-assignment="' + second['id'] + '"]').click()
        popup = opened.value
        playwright.expect(popup.get_by_text('Synthetic resource')).to_be_visible()
        assert popup.evaluate('window.opener === null')
        popup.close()
        with module.get_conn() as conn:
            assert conn.execute('SELECT COUNT(*) FROM app_launch_tokens WHERE assignment_id=? AND identity_id=?',(second['id'],pupil['id'])).fetchone()[0] == 1
            assert conn.execute("SELECT score FROM scores WHERE id='student-score'").fetchone()[0] == 0
        # Students cannot reach teacher management or launch an assignment in another classroom.
        assert context.request.post(address + '/api/student/launch-token', data={'assignment_id':'a'}).status == 404
        assert context.request.get(address + '/api/teacher/summary').status == 401
        assert context.request.post(address + '/api/identities/batch', data={'tenant_id':'denied','count':1,'pin_length':4}).status == 401
        page.locator('#refreshStudent').click()
        playwright.expect(page.locator('#refreshStudent')).to_be_enabled()
        # PIN inputs are already empty; the screenshot contains synthetic metadata only.
        page.screenshot(path=f'/tmp/commons-student-vue-{language}.png', full_page=True)
        # Revoke the actual pupil cookie by rotating its PIN from the teacher API.
        assert client.post('/api/identities/' + pupil['id'] + '/regenerate-pin').status_code == 200
        page.locator('#refreshStudent').click()
        playwright.expect(page.locator('.student-profile')).to_have_count(0)
        playwright.expect(page.locator('#studentLogin')).to_be_enabled()
        assert context.request.get(address + '/api/student/dashboard').status == 401
        assert not errors
        context.close(); browser.close()
