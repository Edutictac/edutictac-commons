/* Commons Rebost client (MIT). No UI framework or editor dependency. */
export class RebostClient {
  constructor(endpoint = '/api/assets/v1') {
    const url = new URL(endpoint, location.href);
    if (url.origin !== location.origin || url.search || url.hash) throw new Error('same_origin_required');
    this.endpoint = url.pathname.replace(/\/$/, '');
  }
  async request(path, options = {}) {
    const response = await fetch(this.endpoint + path, {...options, credentials: 'same-origin', cache: 'no-store'});
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const error = new Error(typeof body.detail === 'string' ? body.detail : 'operation_failed');
      error.status = response.status;
      throw error;
    }
    return response;
  }
  async me() { return (await this.request('/me')).json(); }
  async catalogs() { return (await this.request('/catalogs')).json(); }
  async list({q = '', type = '', cursor = '', collection = 'mine', grouped = false} = {}) {
    return (await this.request('/items?' + new URLSearchParams({q, type, cursor, collection, ...(grouped ? {grouped: 'true'} : {})}))).json();
  }
  itemPath(id) {
    if (!/^img-[a-f0-9]{64}$/.test(id)) throw new Error('invalid_id');
    return '/items/' + id;
  }
  async family(id) { return (await this.request(this.itemPath(id) + '/family')).json(); }
  async read(id, thumbnail = false) {
    return (await this.request(this.itemPath(id) + (thumbnail ? '/thumbnail' : '/content'))).blob();
  }
  async source(id, license = false) {
    return (await this.request(this.itemPath(id) + (license ? '/license' : '/source'))).blob();
  }
  async add(file, name, type) {
    if (!file.size || file.size > 5 * 1024 * 1024) throw new Error('image_limit');
    return (await this.request('/items', {method: 'POST', body: file, headers: {
      'Content-Type': file.type, 'X-Rebost-Name': encodeURIComponent(name), 'X-Rebost-Type': type
    }})).json();
  }
  async update(item, name, type) {
    return (await this.request(this.itemPath(item.id), {method: 'PATCH', headers: {
      'Content-Type': 'application/json', 'If-Match': '"' + item.revision + '"'
    }, body: JSON.stringify({name, type})})).json();
  }
  async duplicate(item) {
    return (await this.request(this.itemPath(item.id) + '/copies', {method: 'POST',
      headers: {'If-Match': '"' + item.revision + '"'}})).json();
  }
  async remove(item) {
    await this.request(this.itemPath(item.id), {method: 'DELETE', headers: {'If-Match': '"' + item.revision + '"'}});
  }
}
