"""Record credits for a file made by hand (stitched, cropped or rotated): 
python3 tools/add_credit.py <topic/file.jpg> '<json of title, artist, date, licence, page, source>'
Use the same keys as find_images.py writes."""
import json, os, sys
C = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'img', 'credits.json')
d = json.load(open(C)) if os.path.exists(C) else {}
d[sys.argv[1]] = json.loads(sys.argv[2])
json.dump(d, open(C, 'w'), indent=2)
print('credit', sys.argv[1])
