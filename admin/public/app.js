try {
  const {mountAdmin}=await import('./assets/admin-ui.js');
  mountAdmin(document.getElementById('adminApp'));
} catch {
  const output=document.getElementById('adminApp');
  output.textContent=window.i18nAdmin.t('admin.loadError');
  output.setAttribute('role','alert');
}
