FROM python:3.12-alpine
WORKDIR /app
COPY server.py .
COPY public public
COPY h5p-libraries h5p-libraries
RUN mkdir -p data/activities && adduser -D -u 1000 play && chown -R play:play /app
USER play
ENV PORT=8083 PLAY_DATA_DIR=/app/data
EXPOSE 8083
CMD ["python", "server.py"]
