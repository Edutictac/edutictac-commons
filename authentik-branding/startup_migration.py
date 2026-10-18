# flake8: noqa
# Migració de sistema d'EduTicTac Commons, executada en cada arrancada
# d'Authentik abans de les migracions de Django.
#
# - Peu de les pantalles d'accés: els blueprints no poden modificar el tenant.
#   Només s'omplin si està buit, per respectar els canvis del centre.
#
# En una instal·lació nova les taules encara no existixen en la primera
# arrancada; els canvis s'apliquen en la següent.
import json

from lifecycle.migrate import BaseMigration

FOOTER_LINKS = [
    {"name": "EduTicTac Commons", "href": "https://edutictac.es/commons.html"},
    {"name": "edutictac.es", "href": "https://edutictac.es/"},
]

class Migration(BaseMigration):
    def table_has_column(self, table: str, column: str) -> bool:
        self.cur.execute(
            "SELECT 1 FROM information_schema.columns WHERE table_name = %s AND column_name = %s;",
            (table, column),
        )
        return bool(self.cur.rowcount)

    def needs_migration(self) -> bool:
        if self.table_has_column("authentik_tenants_tenant", "footer_links"):
            self.cur.execute(
                "SELECT 1 FROM authentik_tenants_tenant "
                "WHERE schema_name = 'public' AND footer_links = '[]'::jsonb;"
            )
            if self.cur.rowcount:
                return True
        return False

    def run(self):
        if self.table_has_column("authentik_tenants_tenant", "footer_links"):
            self.cur.execute(
                "UPDATE authentik_tenants_tenant SET footer_links = %s::jsonb "
                "WHERE schema_name = 'public' AND footer_links = '[]'::jsonb;",
                (json.dumps(FOOTER_LINKS),),
            )
