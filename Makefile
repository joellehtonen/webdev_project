DOCKER_TAG = poke-app-db

.PHONY: install
install: backend db

.PHONY: run_db
run_db:
	docker run --rm -d --name $(DOCKER_TAG) -p 5432:5432 $(DOCKER_TAG) # Resets the database every time

.PHONY: stop_db
stop_db:
	@docker stop $(DOCKER_TAG) 2>/dev/null || echo "Container not running";

.PHONY: backend
backend: 
	npm --prefix backend install

.PHONY: db
db:
	docker build -t $(DOCKER_TAG) .

.PHONY: clean
clean:
	rm -rf backend/node_modules
	docker rmi $(DOCKER_TAG) || true


