.PHONY: all npm validate test security-check clean

ci: clean npm validate test

clean:
	rm -rf output/

npm:
	npm prune
	npm install

validate: npm security-check

test:
	npm test

security-check:
	./node_modules/.bin/retire  --ignore /Users/andrewn/code/gitter/badges/node_modules/gitter-env/node_modules/winston/node_modules/request/node_modules/qs/test/browser/jquery.js
