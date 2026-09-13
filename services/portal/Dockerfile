FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="EduTicTac Commons Portal"
LABEL org.opencontainers.image.description="Portal demo local del producte EduTicTac Commons"
LABEL org.opencontainers.image.licenses="CC-BY-SA-4.0"
LABEL org.opencontainers.image.source="https://git.edutictac.es/Edutictac/edutictac-commons"

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY public /usr/share/nginx/html
