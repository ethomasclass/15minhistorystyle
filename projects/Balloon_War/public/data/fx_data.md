# Data for the v2 3D pieces (`v2/src/fx/`)

All baked by `bake_fx_data.py` in this folder (`python3 -I bake_fx_data.py <scratch_dir>`), November 2026.

## `pacific_winds.json` (PacificWinds)

- **Winds:** NOAA-CIRES-DOE Twentieth Century Reanalysis version 3 (20CRv3), monthly means of daily values on pressure
  levels, ensemble mean of 80 members. File `Datasets/20thC_ReanV3/Monthlies/prsMO/{uwnd,vwnd}.mon.mean.nc` on the NOAA PSL
  THREDDS server, read through OPeNDAP as ASCII:
  `https://psl.noaa.gov/thredds/dodsC/Datasets/20thC_ReanV3/Monthlies/prsMO/uwnd.mon.mean.nc.ascii?uwnd[1666:1670][16:17][100:165][110:270]`
  (and the same for `vwnd`): time indices 1666–1670 = November 1944 – March 1945, levels 300 and 250 hPa, 10–75° N,
  110–270° E, 1° grid.
- **What is baked:** **January 1945, 250 hPa** (≈ 34,000 ft) u and v in m/s on the 1° grid (`lat0` 10, `lon0` 110, 66 × 161,
  row-major from the south). Fastest point: 80.6 m/s (180 mph) at 34° N 159° E. These are real 1944–45 reanalysis values,
  not a long-term mean. A monthly mean is smoother and steadier than any single day.
- **Balloon path:** the piece integrates a path from Ichinomiya (35.37° N, 140.40° E) through this January 1945 field. It
  reaches the Oregon coast (~45.6° N) in about 2.1 days. Real balloons took about three days because they sank lower at
  night and the winds varied from day to day. The screen says "path follows that mean wind".
- **Coastlines:** Natural Earth 1:50m land (`ne_50m_land.geojson`, public domain), clipped to 118–252° E and 12–68° N
  (longitudes 0–360).

## `landing_coast.json` (LandingMap)

Natural Earth 1:50m land, clipped to 160–300° E and 14–74° N. The piece projects it with a Lambert conformal conic
projection (standard parallels 30° and 60°, centred on 125° W and 48° N) and clips it to the slab. Incidents come from
`fugo_incidents.json` (see `fugo_incidents.md`).

## `chiba_hm.json` (SandToBeach)

AWS Terrarium elevation tiles (Mapzen; SRTM / GEBCO), `s3.amazonaws.com/elevation-tiles-prod`, zoom 11. Bounds are
34.88–35.86° N and 139.72–140.92° E (the Boso peninsula). The grid is 240 × 236, in metres, with the sea clamped to 0 m.
The land reaches a maximum of 363 m.

## `gearhart_hm.json` (GearhartTerrain)

AWS Terrarium elevation tiles (Mapzen; SRTM / USGS NED), zoom 11. Bounds are 41.80–42.58° N and 121.50–120.70° W. The grid
is 300 × 360, with heights from 1,227 to 2,511 m.

- **Mitchell Monument:** 42.4316° N, 120.8608° W. This position is from OpenStreetMap (node 357284738), matches
  `fugo_incidents.md`, and is about 10 mi east-northeast of the town of Bly.
- **Other places:**
  - Gearhart Mountain summit: 42.4960° N, 120.8773° W (OpenStreetMap).
  - Bly: 42.398° N, 121.041° W.
  - Tule Lake camp (Newell, California): 41.888° N, 121.375° W.
- **Distance:** the straight line from the monument to the camp is about 46 miles.
