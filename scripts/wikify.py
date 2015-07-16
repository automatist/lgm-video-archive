import urllib
import markdown as _markdown

def markdown (text):
	if (type(text) == str):
		text = text.decode("utf-8")
	return _markdown.markdown(text)

def wikify (n):
	""" returns bytes """
	if (type(n) == int):
		n = "{0}".format(n)
	n = n.strip()
	n = n.replace(" ", "_")
	if type(n) == unicode:
		n = n.encode("utf-8")
	n = urllib.quote(n, '')

	if len(n):
		n = n[0].upper() + n[1:]
	return n

def dewikify (n):
	n = urllib.unquote(n)
	if type(n) == str:
		n = n.decode("utf-8")
	n = n.replace("_", " ")
	return n

def normalize (n):
	return dewikify(wikify(n))