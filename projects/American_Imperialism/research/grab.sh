#!/bin/sh
# grab.sh <url> <out.txt> : fetch a page and keep its plain text (for quote checking)
curl -s -L --max-time 60 -A 'Mozilla/5.0 HistoryResearch' "$1" | python3 -c "
import sys,re,html
t=sys.stdin.read(); t=re.sub(r'<script.*?</script>|<style.*?</style>','',t,flags=re.S); t=html.unescape(re.sub(r'<[^>]+>',' ',t)); t=re.sub(r'[ \t\r\f\v]+',' ',t); print(t)" > "$2"; wc -c "$2"
