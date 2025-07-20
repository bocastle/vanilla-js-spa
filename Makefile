build:
	go build -o vanilla-js-spa .

run: build
	./vanilla-js-spa

clean:
	rm -f vanilla-js-spa 