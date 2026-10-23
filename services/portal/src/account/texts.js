// Textos propis del xip: ha de funcionar també en llocs sense `i18nPortal`
// (edutictac.es, apps estàtiques), per això no usa els diccionaris del portal.
const roles = {
  ca: { administrador: 'Administració', profesor: 'Professorat', alumno: 'Alumnat' },
  es: { administrador: 'Administración', profesor: 'Profesorado', alumno: 'Alumnado' },
  en: { administrador: 'Administration', profesor: 'Teacher', alumno: 'Student' },
};

const ca = {
  home: 'Inici', homeLabel: 'Inici d’EduTicTac', publicHome: 'edutictac.es', nav: 'Compte EduTicTac',
  checking: 'Comprovant…', signIn: 'Entrar', unavailable: 'Sense connexió', retry: 'Tornar a provar',
  teacherLogin: 'Professorat', teacherLoginHint: 'Compte EduTicTac', studentLogin: 'Alumnat', studentLoginHint: 'Codi i PIN',
  dashboardTeacher: 'Tauler docent', dashboardStudent: 'Tauler d’alumnat', account: 'Compte i contrasenya',
  logout: 'Eixir de la sessió', logoutConfirm: 'Vols tancar la sessió en totes les aplicacions d’EduTicTac?',
  logoutError: 'No s’ha pogut tancar la sessió.', student: 'Alumne {code}', localTeacher: 'Accés docent local',
  theme: 'Tema', themeAuto: 'Auto', themeLight: 'Clar', themeDark: 'Fosc', themeAutoHint: 'Segueix el sistema',
  roles: roles.ca,
};

export const TEXT = {
  ca,
  va: { ...ca, dashboardStudent: 'Tauler de l’alumnat' },
  es: {
    home: 'Inicio', homeLabel: 'Inicio de EduTicTac', publicHome: 'edutictac.es', nav: 'Cuenta EduTicTac',
    checking: 'Comprobando…', signIn: 'Entrar', unavailable: 'Sin conexión', retry: 'Reintentar',
    teacherLogin: 'Profesorado', teacherLoginHint: 'Cuenta EduTicTac', studentLogin: 'Alumnado', studentLoginHint: 'Código y PIN',
    dashboardTeacher: 'Panel docente', dashboardStudent: 'Panel del alumnado', account: 'Cuenta y contraseña',
    logout: 'Salir de la sesión', logoutConfirm: '¿Quieres cerrar la sesión en todas las aplicaciones de EduTicTac?',
    logoutError: 'No se ha podido cerrar la sesión.', student: 'Alumno {code}', localTeacher: 'Acceso docente local',
    theme: 'Tema', themeAuto: 'Auto', themeLight: 'Claro', themeDark: 'Oscuro', themeAutoHint: 'Sigue el sistema',
    roles: roles.es,
  },
  en: {
    home: 'Home', homeLabel: 'EduTicTac home', publicHome: 'edutictac.es', nav: 'EduTicTac account',
    checking: 'Checking…', signIn: 'Sign in', unavailable: 'Offline', retry: 'Try again',
    teacherLogin: 'Teachers', teacherLoginHint: 'EduTicTac account', studentLogin: 'Students', studentLoginHint: 'Code and PIN',
    dashboardTeacher: 'Teacher dashboard', dashboardStudent: 'Student dashboard', account: 'Account and password',
    logout: 'Sign out', logoutConfirm: 'Sign out of every EduTicTac application?',
    logoutError: 'Could not sign out.', student: 'Student {code}', localTeacher: 'Local teacher access',
    theme: 'Theme', themeAuto: 'Auto', themeLight: 'Light', themeDark: 'Dark', themeAutoHint: 'Follows the system',
    roles: roles.en,
  },
};

export function pageLang(host) {
  const own = host.dataset.lang;
  if (TEXT[own]) return own;
  const shared = window.i18nPortal?.getLang?.() || window.commonsLanguage?.read?.();
  if (TEXT[shared]) return shared;
  const html = (document.documentElement.lang || '').toLowerCase();
  if (html.includes('valencia')) return 'va';
  const short = html.slice(0, 2);
  return TEXT[short] ? short : 'ca';
}
