from __future__ import print_function
import microdata, json, sys, re
from argparse import ArgumentParser

p = ArgumentParser("")
p.add_argument("--add", action="append", default=[], help="add default value pairs, ex. --add city=Brussels year=2000")
p.add_argument("--output", default="-", help="output, default: - for stdout")
p.add_argument("input", nargs="*", default=[], help="input")
args = p.parse_args()

def parse_value(v):
	v = v.strip()
	if re.search(r"^\d*\.\d+$", v):
		return float(v)
	elif re.search(r"^\d+$", v):
		return int(v)
	else:
		return v

defaults = {}
if args.add != None:
	for p in args.add:
		n, v = p.split("=", 1)
		defaults[n] = parse_value(v)
# print (defaults)
# sys.exit()

if args.output == "-":
	out = sys.stdout
else:
	out = open(args.output, "w")


data = {}
data['items'] = items = []
for i in args.input:
	with open(i) as f:
	    for item in microdata.get_items(f):
	        for n, v in defaults.items():
	        	item.set(n, v)
	        items.append(item.json_dict())

print(json.dumps(data, indent=2), file=out)

