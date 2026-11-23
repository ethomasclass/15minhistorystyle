# The Pacific, drawn from real coastlines (Natural Earth 1:50m land, public domain; assets/geo/pacific_coast.json, baked by
# the template's tools/geo_bake.py), centred on the Pacific so it never splits at the date line. One projection for every
# map in the episode, so the wall map in the pitch room, the coal-gauge map and the chapter 5 islands line up.
#   from pacmap import Pac; m = Pac(x, y, w, h, bbox=(95, -50, 300, 68)); m.xy(lon, lat); m.land_svg(fill)
#   python3 tools/pacmap.py wall      -> blender/assets/pitch_map.png (the wall map texture, 2:1, in the plates' colours)
import json, math, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.abspath(os.path.join(HERE, '..'))
COAST = json.load(open(os.path.join(EP, 'assets', 'geo', 'pacific_coast.json')))['coast']

# places used in the episode (lon in 0..360)
PLACES = {'Honolulu': (202.14, 21.31), 'Pearl Harbor': (202.03, 21.36), 'San Francisco': (237.58, 37.77), 'Manila': (120.98, 14.6),
          'Hong Kong': (114.17, 22.32), 'Yokohama': (139.64, 35.44), 'Midway': (182.63, 28.21), 'Samoa': (189.29, -13.83),
          'Sitka': (224.67, 57.05), 'Shanghai': (121.47, 31.23), 'Guam': (144.79, 13.44)}


class Pac:
    """equirectangular, Pacific-centred: bbox (lon0, lat0, lon1, lat1) fills the rectangle x, y, w, h"""

    def __init__(self, x, y, w, h, bbox=(95, -50, 300, 68)):
        self.x, self.y, self.w, self.h = x, y, w, h
        self.b = bbox

    def xy(self, lon, lat):
        lon0, lat0, lon1, lat1 = self.b
        lon = lon % 360
        return (self.x + (lon - lon0) / (lon1 - lon0) * self.w, self.y + (lat1 - lat) / (lat1 - lat0) * self.h)

    def land_path(self):
        d = []
        for ring in COAST:
            pts = [self.xy(lo, la) for lo, la in ring]
            d.append('M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in pts) + 'z')
        return ''.join(d)

    def graticule(self, step=15, color='#ffffff', op=0.15, width=1.5):
        lon0, lat0, lon1, lat1 = self.b
        o = ''
        for lo in range(int(math.ceil(lon0 / step) * step), int(lon1) + 1, step):
            x, _ = self.xy(lo, 0)
            o += f'<line x1="{x:.1f}" y1="{self.y}" x2="{x:.1f}" y2="{self.y + self.h}" stroke="{color}" stroke-width="{width}" opacity="{op}"/>'
        for la in range(int(math.ceil(lat0 / step) * step), int(lat1) + 1, step):
            _, y = self.xy(lon0, la)
            o += f'<line x1="{self.x}" y1="{y:.1f}" x2="{self.x + self.w}" y2="{y:.1f}" stroke="{color}" stroke-width="{width}" opacity="{op}"/>'
        return o

    def land_svg(self, fill, shade=None, dx=3, dy=4, stroke=None, sw=1.5):
        d = self.land_path()
        o = f'<path d="{d}" fill="{shade}" transform="translate({dx},{dy})"/>' if shade else ''
        st = f' stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"' if stroke else ''
        return o + f'<path d="{d}" fill="{fill}" fill-rule="nonzero"{st}/>'


def wall_texture(out):
    """the pitch room's wall map: cream land on a teal-grey sea with a faint graticule, like the Flow plate; no lettering"""
    W, H = 3000, 1500
    m = Pac(0, 0, W, H, bbox=(95, -50, 300, 68))
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}"><rect width="{W}" height="{H}" fill="#7fa6a2"/>'
           f'<rect width="{W}" height="{H}" fill="#6f9997" opacity="0.35"/>' + m.graticule(15, '#e9dbb8', 0.22, 2.5)
           + m.land_svg('#eadcb9', shade='#5f8885', dx=4, dy=6, stroke='#cdbf9c', sw=1.6) + '</svg>')
    tmp = out + '.svg'
    open(tmp, 'w').write(svg)
    js = ("const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
          "await p.goto('file://%s');await p.screenshot({path:'%s'});await b.close();})()" % (W, H, tmp, out))
    subprocess.run(['node', '-e', js], check=True)
    os.remove(tmp)
    return out


if __name__ == '__main__':
    if sys.argv[1:] == ['wall']:
        print(wall_texture(os.path.join(EP, 'blender', 'assets', 'pitch_map.png')))
