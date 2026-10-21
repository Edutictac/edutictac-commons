import {onBeforeUnmount, ref} from 'vue';

// Keep the portal's existing four dictionaries and persisted preference.
export function usePortalTranslations() {
  const language = ref(window.i18nPortal.getLang());
  const changed = () => { language.value = window.i18nPortal.getLang(); };
  window.addEventListener('edutictac:langchange', changed);
  onBeforeUnmount(() => window.removeEventListener('edutictac:langchange', changed));
  return (key, params) => {
    // Read during render so a language change also translates existing errors.
    language.value;
    return window.i18nPortal.t(key, params);
  };
}
