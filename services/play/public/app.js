try {
  const {mountPlay}=await import('./assets/ui/play-ui.js');
  mountPlay(document.getElementById('playApp'));
} catch {
  const output=document.getElementById('playApp');
  output.textContent='No se ha podido cargar Play. Recarga la página. / No s’ha pogut carregar Play. Recarrega la pàgina. / Could not load Play. Reload the page.';
  output.setAttribute('role','alert');
}
