FROM python:3.12-slim

LABEL org.opencontainers.image.title="EduTicTac Commons Admin"
LABEL org.opencontainers.image.description="Panell d'administracio operativa per al stack local EduTicTac Commons"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.source="https://git.edutictac.es/Edutictac/edutictac-commons"

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Nomes cal el client systemctl per parlar amb el bus d'usuari del host
# (muntat des de fora); aquest contenidor no arranca systemd com a PID1.
# policy-rc.d evita que el postinst del paquet intente arrancar/gestionar
# serveis durant el build. SYSTEMD_OFFLINE=1 nomes per a aquesta RUN (no com
# ENV de la imatge): en temps d'execucio faria que systemctl es negara a
# parlar amb el manager d'usuari del host, tractant-ho com un chroot.
RUN printf '#!/bin/sh\nexit 101\n' > /usr/sbin/policy-rc.d \
    && chmod +x /usr/sbin/policy-rc.d \
    && SYSTEMD_OFFLINE=1 apt-get update \
    && SYSTEMD_OFFLINE=1 apt-get install -y --no-install-recommends systemd \
    && rm -rf /var/lib/apt/lists/*

COPY admin/server.py .
COPY admin/content_sync.py .
COPY admin/modules.py .
COPY admin/public ./public
COPY scripts ./scripts
COPY systemd ./systemd
COPY VERSION .
COPY admin/entrypoint.sh /entrypoint.sh

RUN groupadd --gid 1000 app \
    && useradd --uid 1000 --gid app --create-home --home-dir /home/app app \
    && chown -R app:app /app \
    && chmod +x /entrypoint.sh scripts/*.sh

EXPOSE 8091

ENTRYPOINT ["/entrypoint.sh"]
CMD ["python3", "server.py"]
