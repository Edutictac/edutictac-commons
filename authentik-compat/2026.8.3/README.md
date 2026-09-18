# Authentik 2026.8.3 lifecycle compatibility

These files originate from ghcr.io/goauthentik/server:2026.8.3. Review or
remove these overrides before changing AUTHENTIK_TAG.

Two narrow changes prevent failures observed during first boot:

- Commit the lifecycle connection before Django migrations use a separate
  connection. Otherwise its open transaction can block schema alterations.
  The session advisory lock remains held until release_lock.
- Only run the historical tenant-to-brand conversion when the old tenant
  table has its domain column. Modern tenants have schema_name instead;
  an interrupted new install must not have its modern tenant table renamed.

No database reset or fake migration is performed by these overrides.
