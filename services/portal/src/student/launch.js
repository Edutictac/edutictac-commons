export function resourceUrl(raw, location = window.location) {
  if (!raw) return '';
  const url = new URL(raw, location.origin);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('invalid_url');
  const local = host => ['localhost', '127.0.0.1', '::1', '[::1]'].includes(host);
  if (local(url.hostname) && !local(location.hostname)) {
    url.hostname = location.hostname;
    if (url.port === '8086' && location.port === '18082') url.port = '18086';
  }
  return url.toString();
}

export function activityUrl(assignment, token, language, location = window.location) {
  if (assignment.app_id === 'eduhoot') {
    const protocol = ['localhost', '127.0.0.1'].includes(location.hostname) ? location.protocol : 'http:';
    const url = new URL('/solo/', `${protocol}//${location.hostname}:8090`);
    url.searchParams.set('id', assignment.activity_id);
    url.searchParams.set('commonsLaunchToken', token);
    url.searchParams.set('lang', language);
    return url.toString();
  }
  const ports = {'80': '8084', '8082': '8084', '18082': '18084'};
  const port = location.port || (location.protocol === 'http:' ? '80' : '443');
  const direct = ports[port];
  const base = direct ? `${location.protocol}//${location.hostname}:${direct}` : location.origin;
  const url = new URL((direct ? '/' : '/play/') + encodeURIComponent(assignment.activity_id), base);
  url.searchParams.set('launch_token', token);
  return url.toString();
}

export function returnAfterLogin(identity) {
  if (!identity?.group_id) return false;
  const next = new URLSearchParams(window.location.search).get('next');
  if (!['/assets/', '/blocs-access.html', '/llibres-login.html?lang=es', '/llibres-login.html?lang=va'].includes(next)) return false;
  window.location.replace(next);
  return true;
}
