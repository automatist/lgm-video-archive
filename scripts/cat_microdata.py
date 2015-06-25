from __future__ import print_function
import json, sys
from argparse import ArgumentParser
from unidecode import unidecode

p = ArgumentParser("Simple microdata appender")
p.add_argument("--output", default=None, help="output")
p.add_argument("input", nargs="*", default=[], help="input")
args = p.parse_args()

data = {}
data['items'] = items = []

for i in args.input:
	print ("Reading {0}".format(i), file=sys.stderr)
	with open(i) as f:
		d = json.load(f)
		items.extend(d['items'])

if args.output:
	out = open(args.output, "w")
else:
	out = sys.stdout

json.dump(data, out, indent=2)
