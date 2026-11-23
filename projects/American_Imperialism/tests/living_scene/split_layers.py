# Sort the traced palace shapes into layers. Coordinates in the trace are 2x (3840x2160).
import re, json
src = open('layers/palace_traced2.svg').read()
paths = re.findall(r'<path [^>]*/>', src)
POLYS = [  # the palace outline, hand-set from the plate (1920 px space): rectilinear, so this is exact enough
    [(390, 318), (500, 318), (500, 345), (527, 420), (368, 420), (390, 345)], [(363, 418), (530, 418), (530, 436), (363, 436)],
    [(373, 432), (523, 432), (523, 850), (373, 850)], [(518, 446), (868, 446), (868, 850), (518, 850)],
    [(880, 248), (1045, 248), (1045, 275), (1068, 372), (856, 372), (880, 275)], [(850, 366), (1074, 366), (1074, 388), (850, 388)],
    [(863, 380), (1064, 380), (1064, 850), (863, 850)], [(1058, 446), (1408, 446), (1408, 850), (1058, 850)],
    [(1420, 318), (1530, 318), (1530, 345), (1557, 420), (1398, 420), (1420, 345)], [(1392, 418), (1562, 418), (1562, 436), (1392, 436)],
    [(1402, 432), (1554, 432), (1554, 850), (1402, 850)], [(361, 840), (1564, 840), (1564, 930), (361, 930)],
    [(836, 840), (1094, 840), (1094, 944), (836, 944)], [(955, 20), (970, 20), (970, 290), (955, 290)]]


def inside(p, poly):
    x, y = p; c = False
    for i in range(len(poly)):
        x1, y1 = poly[i]; x2, y2 = poly[(i + 1) % len(poly)]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            c = not c
    return c


def info(p):
    d = re.search(r' d="([^"]+)"', p).group(1)
    tx, ty = map(float, re.search(r'translate\(([-\d.]+),([-\d.]+)\)', p).groups()) if 'translate' in p else (0, 0)
    nums = list(map(float, re.findall(r'-?\d+\.?\d*', d)))
    xs = [(v + tx) / 2 for v in nums[0::2]]; ys = [(v + ty) / 2 for v in nums[1::2]]
    col = re.search(r'fill="(#[0-9A-Fa-f]{6})"', p).group(1)
    r, g, b = (int(col[i:i + 2], 16) for i in (1, 3, 5))
    return dict(x0=min(xs), x1=max(xs), y0=min(ys), y1=max(ys), cx=sum(xs) / len(xs), cy=sum(ys) / len(ys), rgb=(r, g, b))


L = {'sky': [], 'cloud': [], 'mount': [], 'palace': [], 'ground': [], 'palmL': [], 'palmR': [], 'flag': []}
for p in paths:
    i = info(p); r, g, b = i['rgb']
    w = i['x1'] - i['x0']
    inpal = all(any(inside(q, poly) for poly in POLYS) for q in ((i['x0'] + 1, i['y0'] + 1), (i['x1'] - 1, i['y1'] - 1), (i['cx'], i['cy'])))
    if 950 < i['x0'] and i['x1'] < 1125 and i['y0'] > 25 and i['y1'] < 150 and not (i['x1'] - i['x0'] < 12):
        L['flag'].append(p)
    elif inpal:
        L['palace'].append(p)
    elif i['x1'] < 415 and i['y1'] < 1030 and i['y0'] > 150 and (g >= r - 12 or (r > g > b and max(r, g, b) < 130)) and max(r, g, b) < 170:
        L['palmL'].append(p)
    elif i['x0'] > 1505 and i['y1'] < 1030 and i['y0'] > 150 and (g >= r - 12 or (r > g > b and max(r, g, b) < 130)) and max(r, g, b) < 170:
        L['palmR'].append(p)
    elif i['y0'] > 900:
        L['ground'].append(p)
    elif i['y1'] < 500 and r > 190 and r - b > 20 and w < 1700:
        L['cloud'].append(p)
    elif g >= r - 8 and g >= b - 4 and max(r, g, b) < 200 and i['y0'] > 150:
        L['mount'].append(p)
    else:
        L['sky'].append(p)
print({k: len(v) for k, v in L.items()})
for k, v in L.items():
    open(f'layers/L_{k}.svgfrag', 'w').write('\n'.join(v))
# previews: each layer alone
for k in L:
    open(f'layers/prev_{k}.svg', 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 3840 2160"><rect width="3840" height="2160" fill="#ff00ff"/>{"".join(L[k])}</svg>')
