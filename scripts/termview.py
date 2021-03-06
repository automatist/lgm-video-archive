# index of titles
from __future__ import print_function
import json, sys, os, datetime, urllib
from argparse import ArgumentParser
from jinja2 import Environment, FileSystemLoader
from wikify import wikify, dewikify, markdown

p = ArgumentParser("")
p.add_argument("--index", default="microdata/index.json", help="microdata index")
p.add_argument("--templatedir", default="views/templates", help="template directory, default: views/templates")
p.add_argument("--template", default="term.html", help="template name, default: term.html")

# p.add_argument("--term", help="")
p.add_argument("--markdown", help="")
p.add_argument("--output", default=None, help="output, default stdout")

args = p.parse_args()

with open(args.index) as f:
	data = json.load(f)

# terms = data['terms']
# terms = [x for x in terms if args.role in x['roles']]
# terms.sort(key=lambda x: x['term'])

env = Environment(loader=FileSystemLoader(args.templatedir))
env.filters['wikify'] = wikify
env.filters['dewikify'] = dewikify
env.filters['markdown'] = markdown

template = env.get_template(args.template)

base = os.path.splitext(os.path.basename(args.markdown))[0]
term = dewikify(base)

with open(args.markdown) as f:
	markdown = f.read()

if args.output:
	out = open(args.output, "w")
else:
	out = sys.stdout

srcpath = os.path.relpath(args.markdown, os.path.split(args.output)[0])
ts = datetime.datetime.now()
print (template.render(src=srcpath, srcurl=urllib.quote(srcpath, ''), term=term, markdown=markdown, timestamp=ts).encode("utf-8"), file=out)
