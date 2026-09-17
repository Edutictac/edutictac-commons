DOCKER ?= docker
ENV_FILE = $(shell test -f .env && echo .env || echo .env.example)
COMPOSE = $(DOCKER) compose --env-file $(ENV_FILE) -f compose.yml
COMPOSE_EXAMPLE = $(DOCKER) compose --env-file .env.example -f compose.yml

.PHONY: init doctor up up-pulled up-example down build logs ps test-flow test-play-commons test-eduhoot-flow test-reset-flow bootstrap-demo release-check backup backup-check backup-auto backup-prune backup-timer-install backup-timer-status backup-timer-uninstall restore reset images check-images check-updates update-images rollback-images export-images load-images push-images
.PHONY: test-i18n test-installation test-play test-moodle up-recursos up-authentik test-recursos test-teacher-resources test-authentik-config test-group-management

init:
	@test -f .env || cp .env.example .env

doctor:
	./scripts/doctor.sh

up: init
	$(COMPOSE) up --build -d

up-pulled: init
	$(COMPOSE) up -d

up-example:
	$(COMPOSE_EXAMPLE) up --build -d

down:
	$(COMPOSE) down

build: init
	$(COMPOSE) build

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

test-flow:
	./scripts/test-flow.sh

test-play-commons:
	./scripts/test-play-commons-flow.sh

test-i18n:
	npm run test:i18n

test-installation:
	python3 scripts/test-installation.py $(INSTALL_TEST_ARGS)

test-play:
	python3 -m pytest tests/test_play_export.py

test-moodle:
	npm run test:moodle

up-recursos: init
	mkdir -p data/recursos-api
	RECURSOS_API_URL=$${RECURSOS_API_URL:-http://recursos-api:8004} PLAY_INGEST_TOKEN=$${PLAY_INGEST_TOKEN:-local-play-ingest-token} PLAY_PUBLIC_URL=$${PLAY_PUBLIC_URL:-http://localhost:8084} COMPOSE_PROFILES=recursos $(COMPOSE) up --build -d id-api recursos-api recursos play

up-authentik: init
	@echo "Comprueba AUTHENTIK_PG_PASS y AUTHENTIK_SECRET_KEY en .env antes de continuar."
	$(DOCKER) compose --env-file $(ENV_FILE) --profile authentik -f compose.yml up -d authentik-postgresql authentik-server authentik-worker

test-recursos:
	./scripts/test-recursos-flow.sh

test-teacher-resources:
	./scripts/test-teacher-resources-flow.sh

test-authentik-config:
	./scripts/test-authentik-config.sh

test-group-management:
	./scripts/test-group-management.sh

test-eduhoot-flow:
	./scripts/test-eduhoot-flow.sh

test-reset-flow:
	./scripts/test-reset-flow.sh

bootstrap-demo:
	./scripts/bootstrap-demo.sh

release-check:
	./scripts/release-check.sh

backup:
	./scripts/backup.sh

backup-check:
	./scripts/backup-check.sh

backup-auto:
	./scripts/backup-auto.sh

backup-prune:
	./scripts/backup-prune.sh

backup-timer-install:
	./scripts/install-backup-timer.sh

backup-timer-status:
	systemctl --user list-timers edutictac-commons-backup.timer
	systemctl --user status edutictac-commons-backup.service --no-pager -l || true

backup-timer-uninstall:
	./scripts/uninstall-backup-timer.sh

restore:
	@test -n "$(BACKUP)" || (echo "Usa: make restore BACKUP=backups/commons-YYYYmmddTHHMMSSZ/" && exit 1)
	./scripts/restore.sh "$(BACKUP)"

reset:
	./scripts/reset.sh

images: init
	$(COMPOSE) build
	$(COMPOSE) images

check-images:
	./scripts/check-images.sh

check-updates:
	./scripts/check-updates.py

update-images:
	./scripts/update-images.sh

rollback-images:
	@test -n "$(BACKUP)" || (echo "Usa: make rollback-images BACKUP=commons-YYYYmmddTHHMMSSZ" && exit 1)
	./scripts/rollback-images.sh "$(BACKUP)"

export-images: init
	./scripts/export-images.sh

load-images:
	@test -n "$(ARCHIVE)" || (echo "Usa: make load-images ARCHIVE=dist/edutictac-commons-images-0.1.0-alpha.tar" && exit 1)
	./scripts/load-images.sh "$(ARCHIVE)"

push-images: init
	./scripts/push-images.sh
