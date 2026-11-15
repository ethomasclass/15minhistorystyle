"""Rename an image and its credits entry: python3 tools/rename.py <topic/old.jpg> <topic/new.jpg>"""
import json, os, sys
IMG = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'img'); C = os.path.join(IMG, 'credits.json')
old, new = sys.argv[1:3]
os.makedirs(os.path.dirname(os.path.join(IMG, new)), exist_ok=True)
os.rename(os.path.join(IMG, old), os.path.join(IMG, new))
d = json.load(open(C)); d[new] = d.pop(old); json.dump(d, open(C, 'w'), indent=2); print(old, '->', new)
