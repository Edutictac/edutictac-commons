const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function worker() {
  const source = fs.readFileSync('services/play/public/sw.js', 'utf8');
  // Cache versions change when the shell changes. Test retention of the active
  // cache rather than treating a particular historical version as current.
  const match = source.match(/const CACHE = '([^']+)'/);
  assert.ok(match, 'The service worker declares its active cache');
  const active = match[1];
  const obsolete = 'edutictac-play-shell-old-test';
  const listeners = {}, deleted = [];
  const context = {
    self: {
      registration: {scope: 'https://school.test/play/'},
      location: {origin: 'https://school.test'},
      addEventListener: (name, handler) => { listeners[name] = handler; },
      clients: {claim: async () => {}},
    },
    URL,
    caches: {
      keys: async () => ['commons-shell', 'rebost-vue', obsolete, active],
      delete: async key => { deleted.push(key); },
    },
  };
  vm.runInNewContext(source, context);
  return {listeners, deleted, obsolete};
}

test('Play preserves its active cache and the caches of other applications', async () => {
  const {listeners, deleted, obsolete} = worker();
  let done;
  listeners.activate({waitUntil: promise => { done = promise; }});
  await done;
  assert.deepEqual(deleted, [obsolete]);
});

test('Play never caches private activity, review or identity API requests', () => {
  const {listeners} = worker();
  for (const path of ['activities/private', 'submissions/private', 'reviews/private', 'publication/me']) {
    let intercepted = false;
    listeners.fetch({
      request: {url: 'https://school.test/play/api/' + path},
      respondWith: () => { intercepted = true; },
    });
    assert.equal(intercepted, false);
  }
});
