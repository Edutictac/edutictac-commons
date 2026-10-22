(function () {
  'use strict';
  const deployment = window.commonsDeployment || {};
  if (deployment.mode !== 'federated') return;
  const link = document.getElementById('helpResourcesLink');
  try {
    const url = new URL(deployment.applications?.recursos);
    if (url.protocol === 'https:' && !url.username && !url.password) link.href = url.href;
    else link.hidden = true;
  } catch { link.hidden = true; }
  if (deployment.bankFavorites === true) return;
  for (const key of ['step3Text', 'step4Title', 'step4Text', 'securityTitle', 'securityText']) {
    document.querySelector('[data-i18n="help.' + key + '"]').setAttribute('data-i18n', 'help.federated.' + key);
  }
  window.i18nPortal?.applyStaticTranslations?.();
})();
