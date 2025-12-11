build-js:
	npm install
	npm run build

build: build-js
	go build -o vanilla-js-spa .

run: build
	./vanilla-js-spa

run-dev:
	go run main.go

clean:
	rm -f vanilla-js-spa
	rm -rf dist 