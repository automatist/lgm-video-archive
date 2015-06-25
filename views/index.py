# index of titles
import json, sys
from argparse import ArgumentParser
from jinja2 import Environment, FileSystemLoader

p = ArgumentParser("")
p.add_argument("index", help="microdata index")
p.add_argument("--role", default="title", help="role, as in title, presenter")
p.add_argument("--templatedir", default="views/templates", help="microdata index")
p.add_argument("--template", default="index_titles.html", help="microdata index")
args = p.parse_args()

with open(args.index) as f:
	data = json.load(f)
	terms = data['terms']
	terms = [x for x in terms if args.role in x['roles']]
	terms.sort(key=lambda x: x['term'])
	env = Environment(loader=FileSystemLoader(args.templatedir))
	template = env.get_template(args.template)
	print template.render(items=terms).encode("utf-8")
