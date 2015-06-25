
all: microdata/index.json index_titles.html index_speakers.html

microdata = microdata/2014.json

microdata/2014.json:
	microdata.py htdocs-2014-static/program/index.html > microdata/2014.json

microdata/index.json: $(microdata)
	python scripts/index_microdata.py --output $@ $(microdata)

add-microdata:
	python scripts/scrape.py --scraper scripts/scrapers/2014_program.json < htdocs-2014-static/program/index.html > htdocs-2014-static/program/index.microdata.html
	mv htdocs-2014-static/program/index.microdata.html htdocs-2014-static/program/index.html

index_titles.html: microdata/index.json views/templates/index_titles.html
	python views/index.py microdata/index.json --role title --templatedir views/templates --template index_titles.html > $@

index_speakers.html: microdata/index.json views/templates/index_speakers.html
	python views/index.py microdata/index.json --role presenter --templatedir views/templates --template index_speakers.html > $@

