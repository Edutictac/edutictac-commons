DOCKER ?= docker
COMPOSE = $(DOCKER) compose --env-file .env -f compose.yml
COMPOSE_EXAMPLE = $(DOCKER) compose --env-file .env.example -f compose.yml

.PHONY: init up up-example down build logs ps test-flow backup restore reset

init:
	@test -f .env || cp .env.example .env

up: init
	$(COMPOSE) up --build -d

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

backup:
	./scripts/backup.sh

restore:
	@test -n "$(BACKUP)" || (echo "Usa: make restore BACKUP=backups/id-YYYYmmddTHHMMSSZ.db" && exit 1)
	./scripts/restore.sh "$(BACKUP)"

reset:
	./scripts/reset.sh
