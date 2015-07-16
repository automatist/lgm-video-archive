from __future__ import print_function
import json, sys
from argparse import ArgumentParser
from jinja2 import Environment, FileSystemLoader
from wikify import wikify, markdown

def norm (v):
	if type(v) == unicode or type(v) == str:
		v = v.lower()
	return v

def lastword (v):
	words = [norm(x) for x in v.split()]
	ret = [words[-1]]
	ret.extend(words[:-1])
	return ret

def sortkey (i):
	return tuple([norm(i['properties'][x][0]) for x in args.itemsort])

def sortitems (items):
	items.sort(key=sortkey)
	return items

p = ArgumentParser("")
p.add_argument("index", help="microdata index")
p.add_argument("--property", default="title", help="property name to select")
p.add_argument("--templatedir", default="views/templates", help="microdata index")
p.add_argument("--template", default="index_titles.html", help="microdata index")
p.add_argument("--lastword", default=False, action="store_true", help="sort properties by last word (useful for names)")
p.add_argument("--itemsort", default=[], action="append", help="property to sort items by, can by given multiply in order")
p.add_argument("--groupbyletter", default=False, action="store_true", help="sort additionally by letter")
args = p.parse_args()

with open(args.index) as f:
	data = json.load(f)
values = {}
items = data['items']
for i in items:
	for v in i['properties'].get(args.property, []):
		if v not in values:
			values[v] = {'items': []}
		values[v]['items'].append(i)

allvalues = values.keys()

use_key = norm
if args.lastword:
	use_key = lastword
allvalues.sort(key=use_key)

def first_letter (x):
	if (type(x) == list or type(x) == tuple):
		x = x[0]
	ret = x[0].lower()
	if ret < 'a' or ret > 'z':
		return '0'
	return ret

items_by_value = [(v, sortitems(values[v]['items'])) for v in allvalues]
if args.groupbyletter:
	items_by_letter = []
	# letters = "abcdefghijklmnopqrstuvwxyz0"
	curletter = None
	curletter_by_value = None

	for v, items in items_by_value:
		letter = first_letter(use_key(v))
		print (letter, v, file=sys.stderr)
		if (letter != curletter):
			curletter = letter
			curletter_by_value = []
			items_by_letter.append((letter, curletter_by_value))
		curletter_by_value.append((v, items))
	# items_by_value = items_by_letter

env = Environment(loader=FileSystemLoader(args.templatedir))
# env.filters['wikify'] = wikify
env.filters['markdown'] = markdown
template = env.get_template(args.template)

if args.groupbyletter:
	print (template.render(items_by_letter=items_by_letter).encode("utf-8"))
else:
	print (template.render(items_by_value=items_by_value).encode("utf-8"))
