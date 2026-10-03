"""Validate every local HTML link and asset in the actual rendered site."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import sys

root = Path(sys.argv[1] if len(sys.argv)>1 else '_site').resolve()
errors=[]
class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.refs=[]; self.ids=set()
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if attrs.get('id'):self.ids.add(attrs['id'])
        for key in ('href','src'):
            if attrs.get(key):self.refs.append(attrs[key])

pages={}
for file in root.rglob('*.html'):
    parser=Links();parser.feed(file.read_text(encoding='utf-8'));pages[file]=parser
for file,parser in pages.items():
    for ref in parser.refs:
        url=urlsplit(ref)
        if url.scheme or url.netloc:continue
        target=(root/unquote(url.path).lstrip('/')) if url.path.startswith('/') else file.parent/unquote(url.path) if url.path else file
        target=target.resolve()
        if target.is_dir():target=target/'index.html'
        if not target.exists():errors.append(f'{file.relative_to(root)}: missing {ref}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:errors.append(f'{file.relative_to(root)}: missing anchor {ref}')
if errors:
    print('\n'.join(errors));sys.exit(1)
print(f'Validated links and assets in {len(pages)} HTML pages.')
