install:
	npm install .

deploy: 
	grunt package && cd dist && af update consent-cs && cd .. && rm -r dist

clean:
	rm -rf dist