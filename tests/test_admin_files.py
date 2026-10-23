"""Only the fixed classroom-settings endpoint is proxied by standalone admin."""
import io
import json
import urllib.error

from test_admin_modules import api,admin


def test_standalone_admin_proxies_settings_with_original_origin_and_cookie(api,monkeypatch):
    request,_,identity,_=api
    sent=[]
    class Reply(io.BytesIO):status=200
    def upstream(req,timeout):
        if req.full_url==admin.ID_API_ME_URL:return Reply(json.dumps({'identity':identity}).encode())
        sent.append(req)
        assert req.full_url.endswith('/api/admin/files/settings')
        return Reply(json.dumps({'settings':{'max_file_bytes':12}}).encode())
    monkeypatch.setattr(admin.urllib.request,'urlopen',upstream)
    assert request('GET','/api/admin/files/settings')[0]==200
    status,body=request('PUT','/api/admin/files/settings',{'max_file_bytes':12},headers={'Host':'commons.test','Origin':'http://commons.test','X-Commons-Files':'1'})
    assert status==200 and body['settings']['max_file_bytes']==12
    assert sent[-1].get_header('Host')=='commons.test'
    assert sent[-1].get_header('Origin')=='http://commons.test'
    assert json.loads(sent[-1].data)=={'max_file_bytes':12}
    assert request('PUT','/api/admin/files/settings',{},headers={'Host':'commons.test','Origin':'http://attacker.test','X-Commons-Files':'1'})[0]==403
    assert request('PUT','/api/admin/files/settings',{})[0]==403
    assert request('GET','/api/admin/files/settings',headers={'Cookie':''})[0]==401
    assert request('PUT','/api/arbitrary',{})[0]==404


def test_standalone_admin_settings_errors_do_not_expose_upstream_body(api,monkeypatch):
    request,_,identity,_=api
    class Reply(io.BytesIO):status=200
    def upstream(req,timeout):
        if req.full_url==admin.ID_API_ME_URL:return Reply(json.dumps({'identity':identity}).encode())
        raise urllib.error.HTTPError(req.full_url,422,'invalid',{},io.BytesIO(b'synthetic-private-upstream-body'))
    monkeypatch.setattr(admin.urllib.request,'urlopen',upstream)
    status,body=request('GET','/api/admin/files/settings')
    assert status==422 and 'synthetic-private' not in json.dumps(body)
