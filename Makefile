DOCKER ?= docker
ENV_FILE = $(shell test -f .env && echo .env || echo .env.example)
COMPOSE = $(DOCKER) compose --env-file $(ENV_FILE) -f compose.yml
COMPOSE_EXAMPLE = $(DOCKER) compose --env-file .env.example -f compose.yml

.PHONY: init doctor up up-pulled up-example down build logs ps test-flow bootstrap-demo release-check backup backup-check backup-auto backup-prune backup-timer-install backup-timer-status backup-timer-uninstall restore reset images check-images update-images export-images load-images push-images

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

update-images:
	./scripts/update-images.sh

export-images: init
	./scripts/export-images.sh

load-images:
	@test -n "$(ARCHIVE)" || (echo "Usa: make load-images ARCHIVE=dist/edutictac-commons-images-0.1.0-alpha.tar" && exit 1)
	./scripts/load-images.sh "$(ARCHIVE)"

push-images: init
	./scripts/push-images.sh
