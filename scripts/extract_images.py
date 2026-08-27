import urllib.request
import re
import base64
import os

url = 'https://docs.google.com/document/d/1SaDnekYvldIyAKF-_eGOOkFPTDdGYQv8c4vZpUDrmFk/export?format=html'
html = urllib.request.urlopen(url).read().decode('utf-8')

matches = re.findall(r'<img[^>]+src="data:image/([^;]+);base64,([^"]+)"', html)

os.makedirs('/Users/hyungjuncho/my_page/public/images', exist_ok=True)

for i, (ext, data) in enumerate(matches):
    img_data = base64.b64decode(data)
    filename = f'/Users/hyungjuncho/my_page/public/images/neck-pain-{i+1}.{ext}'
    with open(filename, 'wb') as f:
        f.write(img_data)
    print(f"Saved {filename}")
