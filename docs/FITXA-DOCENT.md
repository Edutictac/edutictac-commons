# Fitxa docent — codis i PIN d'EduTicTac

> Document imprimible per al professorat.

## Què és

EduTicTac permet fer activitats, rànquings i seguiment de progrés **sense**
demanar a l'alumnat la identitat real. En lloc d'un compte personal, cada
alumne/a usa un **codi públic + PIN**.

## Com es generen les credencials

1. Entra al tauler del professorat amb el teu compte.
2. Crea un grup i genera un lot de credencials (codi + PIN).
3. Imprimeix les targetes o exporta el CSV de codis.

- El **codi públic** (3 caràcters, per exemple `K7P`) és el que apareix en les
  activitats i els rànquings.
- El **PIN** (4 o 6 dígits) és privat: reparteix-lo només a qui correspon.

## Què es guarda al servidor

- El codi públic i un **hash** del PIN (mai el PIN en clar).
- Les puntuacions i el progrés vinculats al codi.
- Cap nom, correu ni identificador institucional de l'alumnat.

## Què has de saber

- El codi és **pseudònim**, no anònim: tu pots saber qui hi ha darrere de cada
  codi (per exemple, per la targeta que has repartit), però aquesta relació **no
  s'introdueix al sistema**.
- El PIN només es mostra una vegada. Si un alumne/a el perd, **regenera'l** des
  del tauler (no es pot recuperar l'antic).
- Pots **revocar** una credencial si ja no s'ha d'usar.

## Bones pràctiques

- No escriguis el PIN enlloc on es puga veure junt amb el codi i el nom real.
- Reparteix cada targeta directament a l'alumne/a corresponent.
- Revisa `PRIVACITAT.md` i `DIRECCIO-DPD.md` per al detall tècnic i legal.

## Contacte

Centre / responsable: _______________________________________________

Canal de dubtes de privacitat: ______________________________________

<!-- updated: 2026-09-15 -->
