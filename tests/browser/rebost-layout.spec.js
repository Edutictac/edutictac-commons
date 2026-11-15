const {test, expect} = require('@playwright/test');

// El selector incrustat (Llibres, Blocs) viu en un iframe de mida variable: ha de caber, no solapar textos i
// mantindre objectius tàctils usables en tauletes i mòbils.
const EDUCREA = 'https://crea.edutictac.es';
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jL1sAAAAASUVORK5CYII=', 'base64');
const cors = {'access-control-allow-origin': 'http://127.0.0.1:18082', 'access-control-allow-credentials': 'true'};
const item = i => ({id: 'img-' + i.toString(16).padStart(64, '0'), revision: 1, name: 'Imatge ' + i, type: 'sprite', collection: 'catalog',
  readonly: true, width: 480, height: 360, license: 'GPL-3.0-only', attribution: 'Contribuïdors d’EduTicTac Blocs',
  names: {es: 'Personaje con un nombre bastante largo número ' + i}});
const bank = (provider, i, title, license) => ({provider, id: provider + i, title, keywords: [], thumbnail_url: '', content_url: '', license,
  license_url: '', source_url: 'https://example.org/x', credit: 'x', media_type: 'image/png'});

async function mock(page) {
  await page.route(/\/api\/auth\/session(\?|$)/, route => route.fulfill({json: {authenticated: false, kind: 'anonymous', role: 'anonymous', links: {}}}));
  await page.route('**/api/assets/v1/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/me')) return route.fulfill({status: 401, json: {detail: 'session_required'}});
    if (path.endsWith('/catalogs')) return route.fulfill({json: {capabilities: ['catalog', 'scratch_catalog', 'external_banks'], bank_search_url: EDUCREA}});
    if (path.endsWith('/items')) return route.fulfill({json: {items: Array.from({length: 12}, (_, i) => item(i)), next_cursor: ''}});
    return route.fulfill({contentType: 'image/png', body: png});
  });
  await page.route(`${EDUCREA}/**`, route => {
    const provider = /image-banks\/([a-z]+)\/search/.exec(route.request().url())?.[1];
    if (!provider) return route.fulfill({headers: {...cors, 'content-type': 'image/png'}, body: png});
    const license = provider === 'arasaac' ? 'CC BY-NC-SA 4.0' : 'CC BY-SA 4.0';
    return route.fulfill({headers: cors, json: {provider, license, license_url: '', commercial_use: true,
      items: Array.from({length: 5}, (_, i) => bank(provider, i, 'Casa de campo con un título larguísimo de ' + provider + ' número ' + i, license))}});
  });
}

// Mesura dins del iframe: desbordament horitzontal i caixes de text que se solapen.
const MEASURE = () => {
  const visible = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const els = [...document.querySelectorAll('h1,h2,h3,h4,p,label,button,select,input,a,small,legend')].filter(e => visible(e) && (e.innerText || e.value || '').trim());
  const boxes = els.map(e => ({e, r: e.getBoundingClientRect()}));
  const overlaps = [];
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    if (a.e.contains(b.e) || b.e.contains(a.e)) continue;
    const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
    if (w > 4 && h > 4) overlaps.push((a.e.innerText || a.e.value).trim().slice(0, 24) + ' ⨯ ' + (b.e.innerText || b.e.value).trim().slice(0, 24));
  }
  const small = [...document.querySelectorAll('button,select,input:not([type=checkbox]),a.button-link')].filter(visible)
    .map(e => ({t: (e.innerText || e.value || e.tagName).trim().slice(0, 24), h: Math.round(e.getBoundingClientRect().height)})).filter(x => x.h < 40);
  const de = document.documentElement;
  const check = document.querySelector('.banks-free input');
  return {overflow: de.scrollWidth - de.clientWidth, overlaps, small, check: check ? Math.round(check.getBoundingClientRect().width) : 0,
    firstCardTop: Math.round(document.querySelector('#grid article')?.getBoundingClientRect().top ?? -1)};
};

const CASES = [['móvil', {width: 390, height: 780}, [340, 468]], ['iPad vertical', {width: 768, height: 1024}, [690, 614]],
  ['iPad horizontal', {width: 1024, height: 768}, [960, 460]], ['escritorio', {width: 1366, height: 800}, [1040, 480]]];

for (const [name, viewport, [width, height]] of CASES) {
  test(`selector incrustat en ${name} (${width}×${height}): cap, sense solapes i amb objectius tàctils`, async ({page}) => {
    await page.setViewportSize(viewport);
    await mock(page);
    await page.goto('/privacy.html');
    await page.evaluate(([w, h]) => {
      document.body.innerHTML = '';
      const frame = document.createElement('iframe');
      frame.id = 'f'; frame.style.cssText = `width:${w}px;height:${h}px;border:1px solid #888`;
      frame.src = '/assets/?mode=pick&type=sprite&request=t&lang=es&collection=catalog';
      document.body.append(frame);
    }, [width, height]);
    const picker = page.frameLocator('#f');
    await expect(picker.locator('#grid article').first()).toBeVisible();
    const frame = page.frames().find(f => f !== page.mainFrame());
    let m = await frame.evaluate(MEASURE);
    expect(m.overflow, 'desbordament horitzontal').toBeLessThanOrEqual(0);
    expect(m.overlaps, 'textos solapats (catàleg)').toEqual([]);
    expect(m.small, 'objectius tàctils menuts (catàleg)').toEqual([]);
    expect(m.firstCardTop, 'la primera targeta ha de veure\'s sense desplaçar').toBeLessThan(height);

    await picker.locator('#banksTab').click();
    await picker.locator('#banks input[type=search]').fill('casa');
    await picker.locator('#banks button[type=submit]').click();
    await expect(picker.locator('#banks .bank-card').first()).toBeVisible();
    m = await frame.evaluate(MEASURE);
    expect(m.overflow, 'desbordament horitzontal (bancs)').toBeLessThanOrEqual(0);
    expect(m.overlaps, 'textos solapats (bancs)').toEqual([]);
    expect(m.small, 'objectius tàctils menuts (bancs)').toEqual([]);
    expect(m.check, 'la casella del filtre ha de ser de mida normal').toBeLessThanOrEqual(32);
    await expect(picker.locator('#banks button[type=submit]')).toHaveText('Cerca'.replace('Cerca', 'Buscar'));
  });
}

test('el logo de la pàgina completa carrega també darrere dels proxies que només exposen /assets/', async ({page}) => {
  await mock(page);
  await page.goto('/assets/');
  await expect(page.locator('.brand-lockup img')).toBeVisible();
  expect(await page.locator('.brand-lockup img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  expect(await page.locator('.brand-lockup img').getAttribute('src')).toBe('/assets/commons-mark.svg');
});
