import urllib.request
import json

url = "http://159.69.107.150:6333/collections"
response = urllib.request.urlopen(url)
data = json.loads(response.read())
print("Collections:", data)