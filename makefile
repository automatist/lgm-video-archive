microdata = microdata/program_2014.json microdata/program_2013.json microdata/program_2012.json microdata/program_2011.json microdata/program_2010.json microdata/program_2009.json microdata/program_2008.json microdata/program_2007.json

all: $(microdata) microdata/programs.json microdata/index.json index_titles.html index_presenters.html index_years.html

microdata/program_2014.json: htdocs-2014-static/program/index.html
	python scripts/microdata_extract.py --add year=2014 --add city=Leipzig --output $@ $^

microdata/program_2013.json: htdocs-2013-static/program/index.html
	python scripts/microdata_extract.py --add year=2013 --add city=Madrid --output $@ $^

microdata/program_2012.json: htdocs-2012-static/program/index.html
	python scripts/microdata_extract.py --add year=2012 --add city=Vienna --output $@ $^

microdata/program_2011.json: htdocs-2011-static/day-1.html htdocs-2011-static/day-2.html htdocs-2011-static/day-3.html htdocs-2011-static/day-4.html
	python scripts/microdata_extract.py --add year=2011 --add city=Montréal --output $@ $^

microdata/program_2010.json: htdocs-2010-static/program.php.html
	python scripts/microdata_extract.py --add year=2010 --add city=Brussel --output $@ $^

microdata/program_2009.json: htdocs-2009-static/program.php.html
	python scripts/microdata_extract.py --add year=2009 --add city=Montréal --output $@ $^

microdata/program_2008.json: htdocs-2008-static/program.html
	python scripts/microdata_extract.py --add year=2008 --add city=Wrocław --output $@ $^

microdata/program_2007.json: htdocs-2007-static/program.html
	python scripts/microdata_extract.py --add year=2007 --add city=Montréal --output $@ $^

microdata/programs.json: $(microdata)
	python scripts/microdata_cat.py --output $@ $(microdata)


index_titles.html: microdata/programs.json templates/index_titles.html
	python scripts/indexview.py microdata/programs.json --property title --groupbyletter --itemsort title --templatedir templates --template index_titles.html > $@

index_presenters.html: microdata/programs.json templates/index_presenters.html
	python scripts/indexview.py microdata/programs.json --property presenter --lastword --groupbyletter --itemsort year --itemsort title --templatedir templates --template index_presenters.html > $@

index_years.html: microdata/programs.json templates/index_years.html
	python scripts/indexview.py microdata/programs.json --property year --itemsort title --templatedir templates --template index_years.html > $@


clean_pages:
	rm index_*.html

clean:
	rm index_*.html
	rm microdata/*

print-%:
	@echo '$*=$($*)'


