import urllib

def wikify (n):
	n = n.strip()
	n = n.replace(" ", "_")
	if type(n) == unicode:
		n = n.encode("utf-8")
	n = urllib.quote(n, '')

	if len(n):
		n = n[0].upper() + n[1:]
	return n
