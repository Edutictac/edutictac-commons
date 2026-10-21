"""Vue credentials with real API and synthetic accounts in disposable SQLite.

Keep generated PINs only in memory. Do not log credentials or take screenshots
while cards are visible. Nothing connects to the installed Commons database.
"""
from pathlib import Path
import socket
import threading
import time

import pytest
from test_itineraries import api


@pytest.fixture
def live_teacher(api):
    import uvicorn
    from starlette.staticfiles import StaticFiles
    client, module, _ = api
    module.app.mount('/', StaticFiles(directory=Path(__file__).parents[1] / 'services/portal/public', html=True))
    listener = socket.socket()
    listener.bind(('127.0.0.1', 0)); listener.listen(128)
    address = f'http://127.0.0.1:{listener.getsockname()[1]}'
    server = uvicorn.Server(uvicorn.Config(module.app, log_level='error'))
    thread = threading.Thread(target=server.run, kwargs={'sockets': [listener]}, daemon=True)
    thread.start()
    deadline = time.monotonic() + 8
    while not server.started:
        assert thread.is_alive() and time.monotonic() < deadline
        time.sleep(.01)
    try:
        yield client, module, address
    finally:
        server.should_exit = True
        thread.join(timeout=8); listener.close()


@pytest.mark.parametrize('language,touch', [('es', False), ('va', True)])
def test_create_rotate_revoke_and_add_credentials(live_teacher, language, touch):
    playwright = pytest.importorskip('playwright.sync_api')
    client, module, address = live_teacher
    with playwright.sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        teacher = browser.new_context(extra_http_headers={'Authorization': 'Bearer test-only-teacher'}, has_touch=touch, viewport={'width':1024, 'height':1000})
        teacher.add_init_script(f"localStorage.setItem('edutictac-portal-lang','{language}');if(!localStorage.getItem('edutictac-commons-state'))localStorage.setItem('edutictac-commons-state',JSON.stringify({{group:{{id:'group',group_code:'group'}}}}))")
        page = teacher.new_page(); errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.route('**/*', lambda route: route.continue_() if route.request.url.startswith(address + '/') else route.abort())
        page.goto(address + '/teacher.html')
        # The isolated fixture intentionally does not configure a real OIDC provider.
        page.locator('#oidcSetupDialog button[type=submit]').click()
        playwright.expect(page.locator('#createBatch')).to_be_enabled()
        page.locator('#identityCount').fill('1')
        page.locator('#identityCount').press('Enter')
        cards = page.locator('#freshCredentials .credential')
        playwright.expect(cards).to_have_count(1)
        playwright.expect(page.locator('#createBatch')).to_be_enabled()
        code = cards.locator('strong').inner_text()
        pin = cards.locator('span').inner_text().removeprefix('PIN ')
        identity_id = page.locator('#credentialsOutput [data-regenerate-pin]').get_attribute('data-regenerate-pin')
        student = browser.new_context()
        assert student.request.post(address + '/api/auth/student', data={'public_code': code, 'pin': pin}).status == 200
        # Metadata APIs and persistent browser preferences never contain PINs.
        metadata = client.get('/api/teacher/identities').json()['identities']
        assert all('pin' not in row and 'pin_hash' not in row for row in metadata)
        assert page.evaluate("Object.keys(JSON.parse(localStorage.getItem('edutictac-commons-state'))).sort().join(',')") == 'assignment,group'
        page.reload()
        page.locator('#oidcSetupDialog button[type=submit]').click()
        playwright.expect(page.locator('#credentialsOutput tbody tr')).to_have_count(1)
        playwright.expect(page.locator('#freshCredentials')).to_have_count(0)
        page.locator(f'[data-regenerate-pin="{identity_id}"]').click()
        playwright.expect(cards).to_have_count(1)
        playwright.expect(page.locator('#createBatch')).to_be_enabled()
        rotated = cards.locator('span').inner_text().removeprefix('PIN ')
        assert student.request.get(address + '/api/auth/me').status == 401
        assert student.request.post(address + '/api/auth/student', data={'public_code': code, 'pin': rotated}).status == 200
        # Students retain code/PIN access and cannot create teacher-owned classrooms.
        assert student.request.post(address + '/api/identities/batch', data={'tenant_id': 'denied', 'count': 1, 'pin_length': 4}).status == 401
        page.on('dialog', lambda dialog: dialog.accept())
        page.locator(f'[data-revoke-identity="{identity_id}"]').click()
        playwright.expect(page.locator('#credentialsOutput tbody tr')).to_have_count(0)
        playwright.expect(page.locator('#freshCredentials')).to_have_count(0)
        assert student.request.get(address + '/api/auth/me').status == 401
        page.locator('#additionalIdentityCount').fill('1')
        page.locator('#additionalIdentityCount').press('Enter')
        playwright.expect(cards).to_have_count(1)
        playwright.expect(page.locator('#credentialsOutput tbody tr')).to_have_count(1)
        playwright.expect(page.locator('#createBatch')).to_be_enabled()
        page.locator('[data-select-group=group]').click()
        playwright.expect(page.locator('#freshCredentials')).to_have_count(0)
        # Screenshots only after all temporary PINs have been removed from the DOM.
        page.screenshot(path=f'/tmp/commons-credentials-vue-{language}.png', full_page=True)
        assert not errors
        student.close(); teacher.close(); browser.close()
