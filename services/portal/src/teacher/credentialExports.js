// These exports are created only after the teacher explicitly requests them.
// No credentials are stored in browser storage or sent to another service.
export function downloadCredentials(identities, groupCode) {
  const cell = value => {
    let text = String(value);
    if (/^[=+@-]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  };
  const rows = [['codi', 'pin'], ...identities.map(item => [item.public_code, item.pin])];
  const url = URL.createObjectURL(new Blob([rows.map(row => row.map(cell).join(',')).join('\r\n')], {type: 'text/csv;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = `edutictac-${String(groupCode || 'grup').replace(/[^\p{L}\p{N}_-]/gu, '-').slice(0, 80)}.csv`;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function printCredentials(identities, groupCode, t) {
  const win = window.open('', '_blank');
  if (!win) return false;
  win.opener = null;
  const doc = win.document;
  doc.documentElement.lang = document.documentElement.lang;
  doc.title = `EduTicTac ${groupCode || ''}`;
  const policy = doc.createElement('meta');
  policy.httpEquiv = 'Content-Security-Policy';
  policy.content = "default-src 'none'; style-src 'unsafe-inline'; form-action 'none'; base-uri 'none'";
  doc.head.append(policy);
  const style = doc.createElement('style');
  style.textContent = 'body{font:16px Arial,sans-serif;margin:16px;color:#111}main{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}article{border:1px dashed #555;padding:10px;break-inside:avoid}h2{font-size:18px;margin:0 0 8px}p{margin:6px 0 2px}strong,em{display:block;font-size:26px;font-style:normal}small{display:block;margin-top:10px}@media print{body{margin:8mm}}';
  doc.head.append(style);
  const main = doc.createElement('main');
  for (const item of identities) {
    const article = doc.createElement('article');
    for (const [tag, text] of [['h2', 'EduTicTac'], ['p', t('common.code')], ['strong', item.public_code], ['p', 'PIN'], ['em', item.pin], ['small', t('common.useAsStudent')]]) {
      const node = doc.createElement(tag); node.textContent = text; article.append(node);
    }
    main.append(article);
  }
  doc.body.append(main);
  win.focus();
  win.requestAnimationFrame(() => { if (!win.closed) win.print(); });
  return true;
}
