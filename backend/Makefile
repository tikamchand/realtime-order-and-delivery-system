DOCKER_COMPOSE_FILE=deployment/docker-compose.yml
PROJECT_NAME=order-and-delivery-system

start:
	@docker-compose -f $(DOCKER_COMPOSE_FILE) -p $(PROJECT_NAME) down -v
	@docker-compose -f $(DOCKER_COMPOSE_FILE) -p $(PROJECT_NAME) build --no-cache
	@docker-compose -f $(DOCKER_COMPOSE_FILE) -p $(PROJECT_NAME) up -d
