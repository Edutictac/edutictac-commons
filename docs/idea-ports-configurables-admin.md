# Nota d'àudio: Configuració de ports des del panell d'administració

- **Data:** 17 de setembre de 2026, 18:36 CEST
- **Origen:** Missatge de veu de Samuel Soriano a Telegram
- **Context:** EduTicTac Commons — Panell d'Administració / Desplegament
- **Abast:** v2; no bloqueja el tancament de la v1

---

## 🎙️ Transcripció de l'àudio

> "Idea para añadir a EduTicTac Commons: que los puertos de las aplicaciones se puedan cambiar desde el panel de Administración, porque podemos estar en un equipo y puede ser que algún puerto esté ocupado por alguna otra aplicación, entonces que los puertos sean configurables desde el panel de Administración."

---

## 💡 Objectiu i motivació

Quan un centre educatiu o docent desplega EduTicTac Commons en un equip o servidor existent (local, bare-metal o VPS), és habitual que alguns ports per defecte ja estiguen ocupats per altres serveis del sistema o de la xarxa.

Per a millorar l'experiència d'instal·lació i ús:
- Permetre que el **panell d'administració** oferisca una secció o assistent visual de **configuració de ports de xarxa** de les diferents aplicacions i contenidors del stack.
- Evitar conflictes de binding de ports en equips compartits sense requerir l'edició manual directa de fitxers `.env` o `compose.yml` per línia d'ordres.
