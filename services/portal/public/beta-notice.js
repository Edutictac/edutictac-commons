(function () {
  'use strict';
  if (window.commonsDeployment?.releaseStage !== 'beta') return;
  const notice = document.createElement('aside');
  notice.className = 'beta-notice';
  notice.setAttribute('aria-label', 'Beta');
  const label = document.createElement('strong');
  label.textContent = 'BETA';
  const message = document.createElement('span');
  message.setAttribute('data-i18n', 'common.betaNotice');
  message.textContent = window.i18nPortal.t('common.betaNotice');
  notice.append(label, message);
  document.body.prepend(notice);
})();
