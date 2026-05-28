build:
	rm -rf frontend/dist
	npm run build

start:
	npx start-server -s ./frontend/dist

develop:
	make start & make -C frontend dev

install:
	npm ci
	cd frontend && npm ci
