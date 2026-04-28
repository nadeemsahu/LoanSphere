import urllib.request
from urllib.error import HTTPError

try:
    print(urllib.request.urlopen('http://localhost:8080/api/loans').read().decode('utf-8'))
except HTTPError as e:
    print('ERROR:', e.code)
    print(e.read().decode('utf-8'))
