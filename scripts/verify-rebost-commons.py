#!/usr/bin/env python3
"""Disposable Commons nginx/API/Blocs integration; real code/PIN login, no demo cookie.

Uses existing local images and the sibling Blocs build. Never reads .env or
connects to the installed stack. All containers, volumes and the internal
network created here are removed even on failure. No external requests.
"""
import io
import os
from pathlib import Path
import secrets
import subprocess
import tempfile
import time
import uuid

from PIL import Image
from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
BLOCS = Path(os.environ.get('BLOCS_SOURCE_DIR', str(ROOT.parent / 'edutictac-blocs'))).resolve()
API_IMAGE = os.environ.get('REBOST_TEST_IMAGE', 'commons-rebost-check:local')
PREFIX = 'rebost-commons-' + uuid.uuid4().hex[:10]
NETWORK, VOLUME = PREFIX + '-net', PREFIX + '-data'
FRONT = PREFIX + '-front'
containers = []


def docker(*args, content=None):
    result = subprocess.run(['docker', *args], input=content, text=True, capture_output=True, timeout=60)
    if result.returncode:
        raise RuntimeError('Isolated Docker operation failed: ' + args[0])
    return result.stdout.strip()


def mount(source, destination):
    return ['--mount', f'type=bind,src={source},dst={destination},readonly']


def start(role, image, *args, network=NETWORK):
    name = PREFIX + '-' + role
    docker('run', '-d', '--pull=never', '--name', name, '--network', network,
           '--network-alias', role, *args, image)
    containers.append(name)
    return name


SEED = '''
import main
with main.get_conn() as db:
    db.execute("INSERT INTO groups (id,created_at,updated_at) VALUES ('check','2026','2026')")
    for who,code in [('first','ABC'),('second','DEF')]:
        db.execute("INSERT INTO student_identities (id,group_id,public_code,pin_hash,created_at,updated_at) VALUES (?,'check',?,?,'2026','2026')", (who,code,main.hash_pin('1234')))
'''


def scenario(browser, base, language, touch):
    es = language == 'es'
    context = browser.new_context(has_touch=touch, viewport={'width':1024,'height':850})
    context.add_init_script(f"localStorage.setItem('edutictac-portal-lang','{language}');localStorage.setItem('tw:language','{'es' if es else 'ca'}');")
    page = context.new_page()
    # Block anything outside this disposable installation, including external Scratch media.
    page.route('**/*', lambda route: route.continue_() if route.request.url.startswith(base + '/') or route.request.url.startswith(('blob:', 'data:')) else route.abort())
    page.goto(base + '/')
    expect(page.locator('#blocsHomeLink')).to_be_visible()
    page.locator('#blocsHomeLink').click()
    expect(page.locator('#access')).to_be_visible()
    expect(page.locator('#oidcLogin')).to_be_hidden()
    page.locator('#studentLogin').click()
    page.locator('#studentCode').fill('ABC')
    page.locator('#studentPin').fill('1234')
    page.locator('#studentLogin').click()
    page.wait_for_url('**/blocs/editor.html')
    page.wait_for_function('window.vm && vm.runtime.targets.length', timeout=90000)
    assert context.request.get(base + '/api/assets/v1/me').status == 200
    # Blocs receives no replacement auth payload or project-storage contract.
    assert context.request.get(base + '/api/auth/me').json()['identity']['id'] == 'first'
    data = io.BytesIO(); Image.new('RGBA', (80,120), (30,150,100,255)).save(data,'PNG')
    response = context.request.post(base + '/api/assets/v1/items', data=data.getvalue(), headers={
        'Origin':base, 'Content-Type':'image/png', 'X-Rebost-Name':'Commons-login-check', 'X-Rebost-Type':'sprite'})
    assert response.status == 201
    item = response.json()
    label = 'Elegir del Rebost' if es else 'Tria del Rebost'
    menu = page.locator('[class*="sprite-selector_add-button"]')
    main = menu.locator('[class*="main-button"]')
    if touch: main.tap()
    else: main.hover()
    menu.get_by_role('button', name=label, exact=True).click()
    picker = page.frame_locator('iframe[title="' + label + '"]')
    picker.locator('#mineTab').click()
    picker.get_by_role('heading', name='Commons-login-check', exact=True).wait_for()
    picker.get_by_role('button', name='Usar en el proyecto' if es else 'Usa en el projecte', exact=True).click()
    page.wait_for_function('vm.runtime.targets.some(t=>t.getName()==="Commons-login-check")')
    # Logout centrally, then replay the old cookie only inside this disposable test.
    replay = context.cookies()
    assert context.request.post(base + '/api/auth/logout', headers={'Origin':base}).status == 200
    assert context.request.get(base + '/api/assets/v1/me').status == 401
    context.add_cookies(replay)
    assert context.request.get(base + '/api/assets/v1/items/' + item['id']).status == 401
    # Another individual signs in through the real endpoint and cannot read the image.
    other = browser.new_context()
    assert other.request.post(base + '/api/auth/student', data={'public_code':'DEF','pin':'1234'}).status == 200
    assert other.request.get(base + '/api/assets/v1/items/' + item['id']).status == 404
    assert other.request.get(base + '/api/assets/v1/items').json()['items'] == []
    other.close()
    # Re-authenticating the original identity restores its own library.
    context.clear_cookies()
    page.goto(base + '/assets/')
    expect(page.locator('#access')).to_be_visible()
    page.locator('#studentLogin').click()
    page.locator('#studentCode').fill('ABC'); page.locator('#studentPin').fill('1234')
    page.locator('#studentLogin').click()
    page.wait_for_url('**/assets/')
    expect(page.locator('#grid article')).to_have_count(1)
    # Ignore untrusted return URLs; ordinary student dashboard stays available.
    page.goto(base + '/student.html?next=https%3A%2F%2Fexample.invalid')
    expect(page.locator('#studentSessionActions')).to_be_visible()
    assert page.url.startswith(base + '/student.html')
    assert context.request.delete(base + '/api/assets/v1/items/' + item['id'], headers={
        'Origin':base, 'If-Match':'"' + str(item['revision']) + '"'}).status == 204
    # A legacy shared teacher cookie is not a pupil session or private owner.
    legacy = browser.new_context()
    assert legacy.request.post(base + '/api/teacher/login', data={'token':'synthetic-access-check'}).status == 200
    assert legacy.request.get(base + '/api/assets/v1/me').status == 401
    old = legacy.new_page(); old.goto(base + '/student.html?next=%2Fblocs-access.html')
    expect(old.locator('#studentLoginPanel')).to_be_visible()
    assert old.url.startswith(base + '/student.html')
    legacy.close()
    context.close()
    print(language, 'Commons home → code/PIN → Blocs → private picker; logout/replay, isolation and return: OK', flush=True)


def main():
    assert (BLOCS / 'build/editor.html').is_file(), 'Build the sibling Blocs repository first'
    try:
        docker('network', 'create', '--internal', NETWORK)
        # Docker does not publish host ports from an internal-only network.
        # Only nginx joins this second bridge; the API/editor remain offline.
        docker('network', 'create', FRONT)
        docker('volume', 'create', VOLUME)
        with tempfile.TemporaryDirectory(prefix=PREFIX) as temporary:
            env = Path(temporary) / 'api.env'; env.touch(mode=0o600)
            env.write_text('EDUTICTAC_ID_SECRET=' + secrets.token_urlsafe(32) +
                           '\nEDUTICTAC_ID_DB=/data/id.db\nEDUTICTAC_ID_COOKIE_SECURE=0\n'
                           'EDUTICTAC_ID_OIDC_ISSUER_URL=\nEDUTICTAC_ID_OIDC_CLIENT_ID=\n'
                           'EDUTICTAC_ID_OIDC_CLIENT_SECRET=\nQUIOSC_MODE=disabled\n')
            with env.open('a') as file:
                file.write('EDUTICTAC_ID_TEACHER_TOKEN=synthetic-access-check\n')
            api = start('id-api', API_IMAGE, '--env-file', str(env), '--mount', f'type=volume,src={VOLUME},dst=/data')
            for attempt in range(60):
                try:
                    docker('exec', api, 'python', '-c', "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8005/api/health',timeout=2)")
                    break
                except RuntimeError:
                    if attempt == 59: raise
                    time.sleep(.2)
            docker('exec', '-i', api, 'python', '-', content=SEED)
            start('blocs', 'nginxinc/nginx-unprivileged:1.27-alpine',
                  *mount(BLOCS / 'build','/usr/share/nginx/html'),
                  *mount(BLOCS / 'docker/nginx/default.conf.template','/etc/nginx/templates/default.conf.template'),
                  *mount(BLOCS / 'docker/nginx/security-headers.conf','/etc/nginx/snippets/security-headers.conf'),
                  '-e', 'NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1')
            portal = start('portal', 'nginx:1.27-alpine', '-p', '127.0.0.1::80',
                           *mount(ROOT / 'services/portal/public','/usr/share/nginx/html'),
                           *mount(ROOT / 'services/portal/nginx/default.conf','/etc/nginx/conf.d/default.conf'),
                           *mount(ROOT / 'services/portal/nginx/blocs.locations.conf','/etc/nginx/commons-editors/blocs.conf'), network=FRONT)
            docker('network', 'connect', NETWORK, portal)
            base = 'http://' + docker('port', portal, '80/tcp')
            with sync_playwright() as playwright:
                browser = playwright.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox','--use-angle=swiftshader'])
                try:
                    for language,touch in [('es',False),('va',True)]: scenario(browser,base,language,touch)
                    # Without the optional mount, nginx still starts and the homepage hides Blocs.
                    plain = start('plain', 'nginx:1.27-alpine', '-p', '127.0.0.1::80',
                                  *mount(ROOT / 'services/portal/public','/usr/share/nginx/html'),
                                  *mount(ROOT / 'services/portal/nginx/default.conf','/etc/nginx/conf.d/default.conf'), network=FRONT)
                    docker('network', 'connect', NETWORK, plain)
                    page = browser.new_page()
                    page.goto('http://' + docker('port', plain, '80/tcp') + '/')
                    expect(page.locator('#blocsHomeLink')).to_be_hidden()
                    page.close()
                finally: browser.close()
        print('Optional Commons/Blocs nginx integration: OK', flush=True)
    finally:
        for name in reversed(containers): subprocess.run(['docker','rm','-f',name],capture_output=True)
        subprocess.run(['docker','volume','rm',VOLUME],capture_output=True)
        subprocess.run(['docker','network','rm',NETWORK],capture_output=True)
        subprocess.run(['docker','network','rm',FRONT],capture_output=True)


if __name__ == '__main__': main()
