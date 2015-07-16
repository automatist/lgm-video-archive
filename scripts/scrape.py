from __future__ import print_function
from argparse import ArgumentParser
from cssselect2 import ElementWrapper
from urllib2 import urlopen
import html5lib, re, sys, json, urllib
from xml.etree import cElementTree as ET 

"""

Change log

May 7 2015: Changed wrap behaviour to simply work with an elements .text, existing child content (markup) is preserved and untouched. (This makes sense for the LGM 2013 markup, but eventually can imagine wanting to be able to wrap inner HTML content for long-format stuff... this should be an option.)

TODO
-----
* Ability to set / ensure class / other attributes at item level to, for instance, add a class, itemtype.
* Direct JSON output maybe should be deprecated in favor of output of using microdata extraction on the resulting source... (though it's maybe useful for non-microdata scraping)

"""

def indent(elem, level=0):
    """ in-place pretty-printer from effbot.org """
    i = "\n" + level*"  "
    if len(elem):
        if not elem.text or not elem.text.strip():
            elem.text = i + "  "
        if not elem.tail or not elem.tail.strip():
            elem.tail = i
        for elem in elem:
            indent(elem, level+1)
        if not elem.tail or not elem.tail.strip():
            elem.tail = i
    else:
        if level and (not elem.tail or not elem.tail.strip()):
            elem.tail = i


p = ArgumentParser("markup/extract microdata from/to an HTML source using a json-specified scraper description")
p.add_argument("--scraper", action="append", default=[], help="scraper source (JSON)")
p.add_argument("--output", default="html", help="output: html, json (default)")
p.add_argument("--verbose", default=False, action="store_true", help="output: html, json (default)")
p.add_argument("--pretty-print", default=False, action="store_true", help="output: pretty print html")
# p.add_argument("input", nargs="*", help="path (or URL?... todo) of source to process")
args = p.parse_args()


scrapers = []
for s in args.scraper:
    with open(s) as f:
        scrapers.append(json.load(f))

def contents (e):
    ret = u''
    if e.text:
        ret += e.text
    ret += u''.join([ET.tostring(x) for x in e])
    return ret

# def text (e):
#     ret = u''
#     if e.text:
#         ret += e.text
#     ret += u''.join([text(x) for x in e])
#     return ret

def tag_open (elt):
    ret = u"<{0}".format(elt.tag)
    for key, value in elt.attrib.items():
        ret += u" {0}=\"{1}\"".format(key, value)
    ret += u">"
    return ret

def text (e):
    return ET.tostring(e, method="text", encoding="utf-8").decode("utf-8")

class RequirementMissing (Exception):
    pass


def item_selection (item, selector, key="", verbose=False):
    """ item is cssslect2 wrapped element
    todo:
    implement a limited vocabularly of xpath style functions to explicitly:
    * contents() ... innerHTML?!
    * text() (strips HTML)
    * outerHTML
    * strip!
    * removenewlines ?
    * split (",")

    MULTIPLE ITEMS should automatically become LISTS.

    SCRAPE JSON should include good reference back to item (a. generate an ID?! ... b. generate a CSS3 style selector for item ?! )
    """
    required = False
    link = False
    delim = None
    filters = []
    if type(selector) == dict:
        selector_object = selector
        selector = selector_object.get("selector")
        required = selector_object.get("required", False)
        # actually link now means wrap in span
        wrap = selector_object.get("wrap", None)
        delim = selector_object.get("delimiter", None)
        filters_val = selector_object.get("filter", None)
        if filters_val:
            if type(filters_val) == list:
                filters = filters_val
            else:
                filters = [filters_val]

        # print ("Required selector {0}".format(selector), file=sys.stderr)


    val = []
    if verbose:
        print ("query {0}".format(selector), file=sys.stderr)
    for r in item.query_all(selector):
        if verbose:
            print ("  query result {0}".format(r), file=sys.stderr)
        # So in this version, all text is pulled (including that included in sub-tags)
        # ctext = text(r.etree_element).strip()
        
        ctext = (r.etree_element.text or u"").strip()

        # print (u"key: {0}, value: {1}".format(key, ctext).encode("utf-8"), file=sys.stderr)
        names = []
        if ctext:            
            # create one (or more) links
            if delim:
                names = [x.strip() for x in ctext.split(",")]
            else:
                names = [ctext]

            if wrap:
                # for child in r.etree_element:
                #     r.etree_element.remove(child)
                r.etree_element.text = ''
                existing_content = (len(r.etree_element) > 0)
                insert_index = 0
                for i, n in enumerate(names):
                    # insert elements before any existing ones (since this is based on text)
                    # a = ET.SubElement(r.etree_element, wrap)
                    a = ET.Element(wrap)
                    # r.etree_element.remove(a)
                    r.etree_element.insert(insert_index, a)
                    insert_index += 1
                    # a.set("href", index_link(n=n, rel=key))
                    if key:
                        # a.set("rel", key)
                        a.set("itemprop", key)
                    a.text = n
                    if (i+1)<len(names):
                        a.tail = delim + " "
                    elif existing_content:
                        a.tail = " "
        if not wrap:
            r.etree_element.set("itemprop", key)
        val.extend(names)


    if len(val) == 1:
        return val[0]
    elif len(val) > 1:
        return val
    else:
        if required:
            raise RequirementMissing(item)
        return None

items = []

src = sys.stdin.read()
t = html5lib.parse(src, namespaceHTMLElements=False)
doc = ElementWrapper.from_html_root(t)

for scraper in scrapers:
    item_selector = scraper.get("item")
    if args.verbose: print ("Running scraper {0}".format(item_selector), file=sys.stderr)
    for item_elt in doc.query_all(item_selector):
        if args.verbose: print ("ITEM: {0}".format(tag_open(item_elt.etree_element)), file=sys.stderr)
        item_elt.etree_element.set("itemscope", "itemscope")
        # item_elt = match.etree_element
        try:
            item = {}
            for key, selector in scraper['keys'].items():
                if args.verbose:
                    print ("key, selector: {0}, {1}".format(key, selector), file=sys.stderr)
                #continue
                item[key] = item_selection(item_elt, selector, key, verbose=args.verbose)
            items.append(item)
        except RequirementMissing:
            if args.verbose:
                print ("RequirementMissing for selector {0}".format(selector), file=sys.stderr)
            # pass
 

if args.output == "json":
    print (json.dumps(items))
elif args.output == "html":
    if args.pretty_print:
        indent(t)
    print (ET.tostring(t, method="html"))

if args.verbose:
    print ("{0} items".format(len(items)), file=sys.stderr)