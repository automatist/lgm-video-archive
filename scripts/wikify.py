import urllib

def wikify (n):
	""" returns bytes """
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