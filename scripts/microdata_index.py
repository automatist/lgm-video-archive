from __future__ import print_function
import json, sys
from argparse import ArgumentParser
# from unidecode import unidecode
from wikify import wikify

p = ArgumentParser("Produces a reverse look up of md values (terms)")
p.add_argument("--output", default=None, help="output, default stdout")
p.add_argument("--format", default="json", help="Output format: json (index), list (filenames)")
# p.add_argument("--wikify", default=False, action="store_true", help="Extension to append to list output")
p.add_argument("--prepend", default="", help="Extension to prepend to list output")
p.add_argument("--append", default="", help="Extension to append to list output")
p.add_argument("input", nargs="*", default=[], help="input")
args = p.parse_args()

data = {}
data['terms'] = terms = {}

for i in args.input:
	# print ("Reading {0}".format(i), file=sys.stderr)
	with open(i) as f:
		d = json.load(f)
		for item in d['items']:
			item['doc'] = i
			for role, values in item['properties'].items():
				for v in values:
					# vkey = unidecode(v.strip().lower())
					vkey = wikify(v)
					if vkey not in terms:
						terms[vkey] = {'term': vkey, 'forms': [], 'docs': [], 'roles': []}
					terms[vkey]['docs'].append(item)
					if role not in terms[vkey]['roles']:
						terms[vkey]['roles'].append(role)
					if v not in terms[vkey]['forms']:
						terms[vkey]['forms'].append(v)

# flatten terms to sorted list
data['terms'] = [terms[t] for t in sorted(terms.keys())]

if args.output:
	out = open(args.output, "w")
else:
	out = sys.stdout

if args.format == "json":
	json.dump(data, out, indent=2)
elif args.format == "list":
	for t in data['terms']:
		line = t['term']
		if args.prepend:
			line = u"{0}{1}".format(args.prepend, line)
		if args.append:
			line = u"{0}{1}".format(line, args.append)
		print (line.encode("utf-8"), file=out)
