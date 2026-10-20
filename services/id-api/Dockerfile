FROM python:3.12-slim

LABEL org.opencontainers.image.title="EduTicTac Commons ID API"
LABEL org.opencontainers.image.description="API de credencial pseudonima per al stack local EduTicTac Commons"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.source="https://git.edutictac.es/Edutictac/edutictac-commons"

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY vendor/edutictac_community ./edutictac_community
COPY main.py .
COPY module_guard.py .
COPY quiosc ./quiosc
COPY assets ./assets
COPY entrypoint.sh /entrypoint.sh

RUN groupadd --gid 1000 app \
    && useradd --uid 1000 --gid app --create-home --home-dir /home/app app \
    && mkdir -p /data \
    && chown -R app:app /app /data \
    && chmod +x /entrypoint.sh

EXPOSE 8005

ENTRYPOINT ["/entrypoint.sh"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8005"]
