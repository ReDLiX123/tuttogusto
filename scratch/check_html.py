import re

with open('out/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("--- ALL SRC ATTRIBUTES ---")
for m in re.finditer(r'src="([^"]+)"', html):
    print(m.group(1))
