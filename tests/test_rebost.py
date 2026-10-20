"""Rebost contract, privacy and lifecycle against a disposable Commons database."""
import importlib.util
import io
import sqlite3
import sys
from pathlib import Path

import pytest
from fastapi import Response
from fastapi.testclient import TestClient
from PIL import Image, PngImagePlugin


@pytest.fixture
def api(tmp_path, monkeypatch):
    root = Path(__file__).parents[1] / 'services/id-api'
    monkeypatch.syspath_prepend(str(root / 'vendor'))
    monkeypatch.syspath_prepend(str(root))
    monkeypatch.setenv('EDUTICTAC_ID_DB', str(tmp_path / 'id.db'))
    monkeypatch.setenv('EDUTICTAC_ID_SECRET', 'synthetic-rebost-test-signing-key')
    monkeypatch.setenv('EDUTICTAC_ID_TEACHER_TOKEN', 'synthetic-rebost-test-teacher')
    monkeypatch.setenv('EDUTICTAC_ID_COOKIE_SECURE', '0')
    monkeypatch.setenv('EDUTICTAC_ID_OIDC_ISSUER_URL', 'https://identity.test/application/o/commons')
    spec = importlib.util.spec_from_file_location('rebost_test_api', root / 'main.py')
    module = importlib.util.module_from_spec(spec)
    monkeypatch.setitem(sys.modules, spec.name, module)
    spec.loader.exec_module(module)
    with module.get_conn() as db:
        db.execute("INSERT INTO groups (id,created_at,updated_at) VALUES ('group','2026','2026')")
        for who in ['a', 'b']:
            db.execute("INSERT INTO student_identities (id,group_id,public_code,pin_hash,created_at,updated_at) VALUES (?,'group',?,'unused','2026','2026')", (who, who))
    def student(who):
        response = Response()
        module.set_student_session(response, who)
        client = TestClient(module.app)
        client.headers['Origin'] = 'http://testserver'
        # Synthetic cookies never leave this in-process test server.
        client.headers['Cookie'] = response.headers['set-cookie'].split(';')[0]
        return client
    return module, student('a'), student('b'), student


def image(mode='PNG', size=(120, 80)):
    out = io.BytesIO()
    options = {}
    if mode == 'PNG':
        info = PngImagePlugin.PngInfo(); info.add_text('private-test-metadata', 'discard')
        options['pnginfo'] = info
    Image.new('RGB', size, (25, 155, 80)).save(out, mode, **options)
    return out.getvalue()


def upload(client, data=None, name='Imatge', kind='sprite', mime='image/png'):
    from urllib.parse import quote
    return client.post('/api/assets/v1/items', content=image() if data is None else data,
                       headers={'Content-Type': mime, 'X-Rebost-Name': quote(name), 'X-Rebost-Type': kind})


def path(item):
    return '/api/assets/v1/items/' + item['id']


def revision(item):
    return {'If-Match': '"' + str(item['revision']) + '"'}


def test_crud_preserves_dimensions_and_strips_metadata(api):
    module, client, _, _ = api
    item = upload(client, image(size=(960,360)), 'Teatre', 'background').json()
    assert (item['width'], item['height']) == (960,360)
    assert client.get('/api/assets/v1/items?q=Teatre&type=background').json()['items'] == [item]
    assert client.get('/api/assets/v1/items?q=other').json()['items'] == []
    content = client.get(path(item)+'/content')
    assert content.status_code == 200 and content.headers['Cache-Control'] == 'private, no-store'
    assert content.headers['X-Content-Type-Options'] == 'nosniff'
    with Image.open(io.BytesIO(content.content)) as decoded:
        assert decoded.size == (960,360) and 'private-test-metadata' not in decoded.info
    with Image.open(io.BytesIO(client.get(path(item)+'/thumbnail').content)) as thumb:
        assert max(thumb.size) <= 256
    changed = client.patch(path(item), headers=revision(item), json={'name':'Teatre nou','type':'illustration'}).json()
    assert changed['id'] == item['id'] and changed['revision'] == 2
    copy = client.post(path(changed)+'/copies', headers=revision(changed)).json()
    assert copy['id'] != item['id']
    with module.get_conn() as db:
        assert db.execute('SELECT COUNT(*) FROM asset_contents').fetchone()[0] == 1
    assert client.delete(path(changed), headers=revision(changed)).status_code == 204
    assert client.get(path(copy)+'/content').status_code == 200
    assert client.delete(path(copy), headers=revision(copy)).status_code == 204
    with module.get_conn() as db:
        assert db.execute('SELECT COUNT(*) FROM asset_contents').fetchone()[0] == 0


def test_private_resources_never_cross_accounts(api):
    module, a, b, _ = api
    item = upload(a).json()
    assert b.get('/api/assets/v1/items').json()['items'] == []
    for suffix in ['', '/content', '/thumbnail']:
        assert b.get(path(item)+suffix).status_code == 404
    assert b.post(path(item)+'/copies', headers=revision(item)).status_code == 404
    assert b.patch(path(item), headers=revision(item), json={'name':'Other','type':'sprite'}).status_code == 404
    assert b.delete(path(item), headers=revision(item)).status_code == 404
    other = upload(b).json()
    assert other['id'] != item['id']
    with module.get_conn() as db:
        assert db.execute('SELECT COUNT(*) FROM asset_contents').fetchone()[0] == 2


def test_technical_credentials_are_not_individual_owners(api):
    module, _, _, _ = api
    client = TestClient(module.app)
    client.headers['Authorization'] = 'Bearer synthetic-rebost-test-teacher'
    assert client.get('/api/assets/v1/me').status_code == 401
    response = Response()
    response.set_cookie(module.TEACHER_COOKIE, module.make_cookie({'teacher':True,'teacher_id':'teacher-token'}))
    client.headers['Cookie'] = response.headers['set-cookie'].split(';')[0]
    assert client.get('/api/assets/v1/me').status_code == 401


def test_student_revocation_and_stable_principal(api):
    module, a, _, login = api
    item = upload(a).json()
    replay = a.headers['Cookie']
    assert a.post('/api/auth/logout').status_code == 200
    a.headers['Cookie'] = replay
    assert a.get(path(item)).status_code == 401
    fresh = login('a')
    assert fresh.get(path(item)).status_code == 200
    with module.get_conn() as db:
        db.execute("UPDATE student_identities SET active=0 WHERE id='a'")
    assert fresh.get(path(item)).status_code == 401
    with module.get_conn() as db:
        db.execute("DELETE FROM groups WHERE id='group'")
    assert fresh.get(path(item)).status_code == 401


def test_oidc_sessions_are_revocable_and_provider_scoped(api):
    module, _, _, _ = api
    def oidc(sub='same-subject'):
        response = Response()
        module.set_oidc_cookie(response, {'sub':sub}, 'profesor')
        client = TestClient(module.app); client.headers['Origin'] = 'http://testserver'
        client.headers['Cookie'] = response.headers['set-cookie'].split(';')[0]
        return client
    a = oidc(); item = upload(a).json()
    fresh = oidc()
    assert fresh.get(path(item)).status_code == 200
    assert oidc('other-subject').get(path(item)).status_code == 404
    a.post('/api/auth/oidc/logout')
    assert a.get(path(item)).status_code == 401
    assert fresh.get(path(item)).status_code == 200
    with module.get_conn() as db:
        db.execute("UPDATE asset_sessions SET expires_at='2000-01-01'")
    assert fresh.get(path(item)).status_code == 401


@pytest.mark.parametrize('content,mime,status', [
    (b'<svg onload="alert(1)"/>','image/png',415),
    (b'MZ'+b'\0'*100,'image/png',415),
    (b'\x89PNG\r\n\x1a\n','image/png',415),
    (image(),'image/jpeg',415),
    (image(size=(4097,1)),'image/png',413),
    (b'0'*(5*1024*1024+1),'image/png',413),
])
def test_dangerous_or_oversized_images_are_rejected(api, content, mime, status):
    _, client, _, _ = api
    assert upload(client, content, mime=mime).status_code == status
    assert client.get('/api/assets/v1/items').json()['items'] == []


def test_origin_metadata_and_revision_guards(api):
    _, client, _, _ = api
    client.headers['Origin'] = 'https://other.test'
    assert upload(client).status_code == 403
    client.headers.pop('Origin')
    assert upload(client).status_code == 403
    client.headers['Origin'] = 'http://testserver'
    assert upload(client, name='\ninvalid').status_code == 422
    assert upload(client, kind='sound').status_code == 422
    item = upload(client).json()
    assert client.patch(path(item), json={'name':'Other','type':'sprite'}).status_code == 412
    changed = client.patch(path(item), headers=revision(item), json={'name':'New','type':'sprite'}).json()
    assert client.delete(path(item), headers=revision(item)).status_code == 412
    assert client.post(path(item)+'/copies', headers=revision(item)).status_code == 412
    assert client.get(path(changed)).json()['name'] == 'New'


def test_quotes_limits_and_storage_cleanup(api, monkeypatch):
    module, client, _, _ = api
    item = upload(client).json()
    monkeypatch.setattr(sys.modules['assets'], 'MAX_ITEMS', 1)
    assert client.post(path(item)+'/copies', headers=revision(item)).status_code == 413
    monkeypatch.setattr(sys.modules['assets'], 'MAX_ITEMS', 200)
    module.rebost.global_limit = 1
    assert upload(client, image(size=(9,7))).status_code == 413
    module.rebost.global_limit = 2*1024**3
    module.rebost.disk_reserve = 2**60
    assert upload(client, image(size=(9,7))).status_code == 507
    assert client.get(path(item)+'/content').status_code == 200


def test_pagination_and_literal_search(api):
    _, client, _, _ = api
    items = [upload(client, name=name).json() for name in ['100%','100_','Ànec']]
    first = client.get('/api/assets/v1/items?limit=2').json()
    second = client.get('/api/assets/v1/items', params={'cursor':first['next_cursor'],'limit':2}).json()
    assert len(first['items']) == 2 and len(second['items']) == 1
    assert {item['id'] for item in first['items']+second['items']} == {item['id'] for item in items}
    assert len(client.get('/api/assets/v1/items',params={'q':'%'}).json()['items']) == 1


def test_sqlite_snapshot_restores_pixels_principals_and_sessions(api, tmp_path):
    module, client, _, _ = api
    item = upload(client).json()
    from contextlib import closing
    target = tmp_path / 'restored.db'
    with closing(module.get_conn()) as source, closing(sqlite3.connect(target)) as destination:
        source.backup(destination)
    with closing(sqlite3.connect(target)) as restored:
        assert restored.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
        assert restored.execute('SELECT name FROM assets WHERE id=?',(item['id'],)).fetchone()[0] == item['name']
        assert restored.execute('SELECT COUNT(*) FROM asset_principals').fetchone()[0] == 1
        assert restored.execute('SELECT COUNT(*) FROM student_sessions').fetchone()[0] == 2
        assert restored.execute('SELECT data FROM asset_contents').fetchone()[0] == client.get(path(item)+'/content').content
    # A new service instance on the same persistent file retains the library.
    library = type(module.rebost)(module.get_conn,module.DB_PATH,module.oidc_cookie,module.current_identity)
    assert library.db_path == module.DB_PATH
    assert client.get(path(item)).status_code == 200


def test_parallel_edits_and_limits_are_atomic(api, monkeypatch):
    from concurrent.futures import ThreadPoolExecutor
    module, client, _, _ = api
    item = upload(client).json()
    def edit(name):
        return client.patch(path(item), headers=revision(item), json={'name':name,'type':'sprite'}).status_code
    with ThreadPoolExecutor(max_workers=2) as pool:
        assert sorted(pool.map(edit, ['First', 'Second'])) == [200, 412]
    monkeypatch.setattr(sys.modules['assets'], 'MAX_ITEMS', 2)
    def add(_):
        return upload(client).status_code
    with ThreadPoolExecutor(max_workers=2) as pool:
        assert sorted(pool.map(add, [1,2])) == [201,413]
    assert len(client.get('/api/assets/v1/items').json()['items']) == 2


def test_fixed_formats_and_animation(api):
    _, client, _, _ = api
    for fmt, mime in [('JPEG','image/jpeg'),('WEBP','image/webp')]:
        assert upload(client, image(fmt), mime=mime).status_code == 201
    first, second = Image.new('RGB',(10,10),'red'), Image.new('RGB',(10,10),'blue')
    animated = io.BytesIO(); first.save(animated, 'PNG', save_all=True, append_images=[second], duration=50, loop=0)
    assert upload(client, animated.getvalue()).status_code == 415


@pytest.mark.parametrize('language,touch', [('es', False), ('va', True)])
def test_browser_private_library(api, tmp_path, language, touch):
    playwright = pytest.importorskip('playwright.sync_api')
    import socket
    import threading
    import time
    import uvicorn
    from starlette.staticfiles import StaticFiles
    module, client, _, _ = api
    public = Path(__file__).parents[1] / 'services/portal/public'
    module.app.mount('/', StaticFiles(directory=public, html=True))
    listener = socket.socket(); listener.bind(('127.0.0.1', 0)); listener.listen(128)
    address = f'http://127.0.0.1:{listener.getsockname()[1]}'
    server = uvicorn.Server(uvicorn.Config(module.app, log_level='error'))
    thread = threading.Thread(target=server.run, kwargs={'sockets':[listener]}, daemon=True); thread.start()
    deadline = time.monotonic()+8
    while not server.started:
        assert thread.is_alive() and time.monotonic()<deadline, 'Local test server failed to start'
        time.sleep(.01)
    try:
        with playwright.sync_playwright() as p:
            browser = p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
            context = browser.new_context(has_touch=touch, viewport={'width':1024 if touch else 1280,'height':800})
            context.add_init_script(f"localStorage.setItem('edutictac-portal-lang','{language}')")
            cookie_name, cookie_value = client.headers['Cookie'].split('=',1)
            context.add_cookies([{'name':cookie_name,'value':cookie_value,'url':address}])
            page = context.new_page(); errors=[]
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.route('**/*', lambda route: route.continue_() if route.request.url.startswith(address) or route.request.url.startswith('blob:') else route.abort())
            page.goto(address+'/assets/')
            controls = page.locator('#controls')
            playwright.expect(controls).to_be_enabled()
            playwright.expect(page.locator('#mine')).to_have_text('Mis imágenes' if language=='es' else 'Les meues imatges')
            page.locator('#files').set_input_files({'name':'Anec.png','mimeType':'image/png','buffer':image(size=(960,360))})
            playwright.expect(page.locator('article')).to_have_count(1)
            playwright.expect(controls).to_be_enabled()
            card = page.locator('article')
            card.get_by_label('Nombre' if language=='es' else 'Nom',exact=True).fill('<img src=x onerror=alert(1)>')
            card.get_by_role('button',name='Guardar cambios' if language=='es' else 'Guarda els canvis',exact=True).click()
            playwright.expect(controls).to_be_enabled()
            page.reload()
            playwright.expect(controls).to_be_enabled()
            playwright.expect(page.locator('article input')).to_have_value('<img src=x onerror=alert(1)>')
            assert page.locator('article img').count()==1
            page.locator('article').get_by_role('button',name='Duplicar' if language=='es' else 'Duplica',exact=True).click()
            playwright.expect(page.locator('article')).to_have_count(2)
            playwright.expect(controls).to_be_enabled()
            page.on('dialog',lambda dialog:dialog.accept())
            page.locator('article').first.get_by_role('button',name='Eliminar' if language=='es' else 'Elimina',exact=True).click()
            playwright.expect(page.locator('article')).to_have_count(1)
            playwright.expect(controls).to_be_enabled()
            page.locator('article .image').click()
            playwright.expect(page.locator('#preview')).to_be_visible()
            page.locator('#closePreview').click()
            page.locator('#files').set_input_files({'name':'disguised.png','mimeType':'image/png','buffer':b'<svg onload="alert(1)"/>'})
            playwright.expect(page.locator('#status')).to_contain_text('PNG, JPEG o WebP')
            assert page.locator('article').count()==1
            # The system catalogue has read-only cards and creates explicit private copies.
            page.locator('#catalogTab').click()
            playwright.expect(page.locator('article')).to_have_count(12)
            playwright.expect(controls).to_be_enabled()
            playwright.expect(page.locator('#uploadArea')).to_be_hidden()
            assert page.locator('article input').count()==0
            assert page.get_by_role('button',name='Eliminar' if language=='es' else 'Elimina',exact=True).count()==0
            page.locator('#search').fill('Bosque')
            playwright.expect(page.locator('article')).to_have_count(1)
            playwright.expect(controls).to_be_enabled()
            with page.expect_download() as download:
                page.get_by_role('button',name='Descargar original SVG' if language=='es' else 'Descarrega l’original SVG',exact=True).click()
            assert download.value.suggested_filename.endswith('.source.svg')
            playwright.expect(controls).to_be_enabled()
            page.get_by_role('button',name='Guardar en mis imágenes' if language=='es' else 'Guarda en les meues imatges',exact=True).click()
            playwright.expect(page.locator('#mineTab')).to_have_attribute('aria-pressed','true')
            playwright.expect(page.locator('article')).to_have_count(2)
            playwright.expect(page.locator('article .credit')).to_contain_text('GPL-3.0-only')
            assert not errors
            page.screenshot(path=str(tmp_path/f'rebost-{language}.png'))
            # A second browser without an authenticated individual gets the access screen, no images.
            other=browser.new_context(); second=other.new_page(); second.goto(address+'/assets/')
            playwright.expect(second.locator('#access')).to_be_visible()
            playwright.expect(second.locator('#controls')).to_be_hidden()
            other.close(); browser.close()
    finally:
        server.should_exit=True; thread.join(timeout=8); listener.close()


def test_public_origin_behind_a_tls_proxy(api):
    module, client, _, _ = api
    module.rebost.public_origin = 'https://commons.example.test'
    client.headers['Origin'] = 'https://commons.example.test'
    assert upload(client).status_code == 201
    client.headers['Origin'] = 'http://testserver'
    assert upload(client).status_code == 403


def test_openapi_exposes_the_shared_upload_contract(api):
    _, client, _, _ = api
    operation = client.get('/openapi.json').json()['paths']['/api/assets/v1/items']['post']
    assert set(operation['requestBody']['content']) == {'image/png','image/jpeg','image/webp'}
    assert {p['name']:p['required'] for p in operation['parameters']} == {
        'X-Rebost-Name':True,'X-Rebost-Type':True,'X-Rebost-Source':False,'If-Match':False}
