#!/usr/bin/env sh
# Prova de regressió: evita que .env.example i scripts/doctor.sh tornen a
# quedar sense els valors/avisos necessaris per a que Authentik SSO funcione
# des de la instal·lació neta (veure "Activar Authentik SSO" en INSTALL-CENTRES.md).
set -eu

cd "$(dirname "$0")/.."

fail() {
  echo "FALLA: $1" >&2
  exit 1
}

# 1. .env.example ha de portar EDUTICTAC_ID_OIDC_ROLE_CLAIM=groups per defecte
#    (id-api usa "roles" com a valor per defecte intern si no es fixa aci, i
#    el blueprint d'Authentik mapeja els grups a la claim "groups").
role_claim="$(grep '^EDUTICTAC_ID_OIDC_ROLE_CLAIM=' .env.example | tail -n 1 | cut -d= -f2-)"
[ "$role_claim" = "groups" ] || fail ".env.example: EDUTICTAC_ID_OIDC_ROLE_CLAIM hauria de ser 'groups' (actual: '${role_claim:-buit}')"

# 2. EDUHOOT_AUTHENTIK_CLIENT_ID/_SECRET han d'existir com a variables buides
#    (client OAuth2 compartit amb EDUTICTAC_ID_OIDC_CLIENT_ID/_SECRET).
grep -q '^EDUHOOT_AUTHENTIK_CLIENT_ID=' .env.example || fail ".env.example: falta EDUHOOT_AUTHENTIK_CLIENT_ID"
grep -q '^EDUHOOT_AUTHENTIK_CLIENT_SECRET=' .env.example || fail ".env.example: falta EDUHOOT_AUTHENTIK_CLIENT_SECRET"

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

# doctor.sh fa "cd $(dirname "$0")/.." per a trobar l'.env, aixi que cal una
# copia dins del tmpdir (amb el seu propi scripts/) perque no llija l'.env
# real del repo.
mkdir -p "$tmpdir/scripts"
cp scripts/doctor.sh "$tmpdir/scripts/doctor.sh"
chmod +x "$tmpdir/scripts/doctor.sh"

# 3. scripts/doctor.sh ha d'avisar si COMPOSE_PROFILES inclou 'authentik' pero
#    falten variables EDUTICTAC_ID_OIDC_*.
incomplete_env="$tmpdir/.env"
cat > "$incomplete_env" <<'EOF'
PORTAL_PORT=8082
COMPOSE_PROFILES=authentik
EDUTICTAC_ID_OIDC_ROLE_CLAIM=groups
EOF

out="$(DOCKER=true "$tmpdir/scripts/doctor.sh" 2>&1 || true)"
case "$out" in
  *"AVIS: COMPOSE_PROFILES inclou 'authentik' pero falten variables"*) ;;
  *) fail "doctor.sh no avisa amb .env incomplet (authentik actiu sense EDUTICTAC_ID_OIDC_*):
$out" ;;
esac

# 4. scripts/doctor.sh ha d'avisar si EDUTICTAC_ID_OIDC_ROLE_CLAIM no és 'groups'.
wrong_role_env="$tmpdir/.env"
cat > "$wrong_role_env" <<'EOF'
PORTAL_PORT=8082
COMPOSE_PROFILES=authentik
EDUTICTAC_ID_OIDC_ISSUER_URL=http://edutictac.local:9000/application/o/edutictac-commons/
EDUTICTAC_ID_OIDC_CLIENT_ID=test-client
EDUTICTAC_ID_OIDC_CLIENT_SECRET=test-secret
EDUTICTAC_ID_OIDC_REDIRECT_URL=http://edutictac.local:8082/api/auth/oidc/callback
EDUTICTAC_ID_OIDC_ROLE_CLAIM=roles
EOF

out="$(DOCKER=true "$tmpdir/scripts/doctor.sh" 2>&1 || true)"
case "$out" in
  *"AVIS: EDUTICTAC_ID_OIDC_ROLE_CLAIM hauria de ser 'groups'"*) ;;
  *) fail "doctor.sh no avisa quan EDUTICTAC_ID_OIDC_ROLE_CLAIM val 'roles':
$out" ;;
esac

# 5. Amb totes les variables presents i ROLE_CLAIM=groups, doctor.sh ha de
#    mostrar el missatge d'èxit i cap avís d'Authentik.
complete_env="$tmpdir/.env"
cat > "$complete_env" <<'EOF'
PORTAL_PORT=8082
COMPOSE_PROFILES=authentik
EDUTICTAC_ID_OIDC_ISSUER_URL=http://edutictac.local:9000/application/o/edutictac-commons/
EDUTICTAC_ID_OIDC_CLIENT_ID=test-client
EDUTICTAC_ID_OIDC_CLIENT_SECRET=test-secret
EDUTICTAC_ID_OIDC_REDIRECT_URL=http://edutictac.local:8082/api/auth/oidc/callback
EDUTICTAC_ID_OIDC_ROLE_CLAIM=groups
EOF

out="$(DOCKER=true "$tmpdir/scripts/doctor.sh" 2>&1 || true)"
case "$out" in
  *"OK Authentik OIDC: variables EDUTICTAC_ID_OIDC_* presents"*) ;;
  *) fail "doctor.sh no mostra 'OK Authentik OIDC' amb .env complet:
$out" ;;
esac
case "$out" in
  *"AVIS:"*) fail "doctor.sh mostra un AVIS inesperat amb .env complet i correcte:
$out" ;;
esac

echo "OK: .env.example i scripts/doctor.sh mantenen els valors/avisos d'Authentik SSO"
