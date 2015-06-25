
all: microdata/index.json index_titles.html index_speakers.html

microdata = microdata/2014.json

# once only inject-microdata step (hand corrections from then on)
inject-microdata:
	python scripts/scrape.py --scraper scripts/scrapers/2014_program.json < htdocs-2014-static/program/index.html > htdocs-2014-static/program/index.microdata.html
	mv htdocs-2014-static/program/index.microdata.html htdocs-2014-static/program/index.html

# extract (corrected) microdata from html to separate json files

microdata/2014.json: htdocs-2014-static/program/index.html
	microdata.py htdocs-2014-static/program/index.html > microdata/2014.json

# Concatenate & reverse-index (by values) microdata

microdata/index.json: $(microdata)
	python scripts/microdata_index.py --output $@ $(microdata)

# Views

index_titles.html: microdata/index.json views/templates/index_titles.html
	python views/index.py microdata/index.json --role title --templatedir views/templates --template index_titles.html > $@

index_speakers.html: microdata/index.json views/templates/index_speakers.html
	python views/index.py microdata/index.json --role presenter --templatedir views/templates --template index_speakers.html > $@

clean:
	rm index_*.html

terms_md = $(shell python scripts/microdata_index.py --format list --prepend "terms/" --append ".md" microdata/2014.json)

terms_html = $(terms_md:%.md=%.html)

.PHONY: terms

terms: microdata/index.json
	mkdir -p terms
	$(foreach x,$(terms_md),scripts/ensure.sh $x ;)

print-%:
	@echo '$*=$($*)'


