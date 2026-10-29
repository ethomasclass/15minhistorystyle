# Sample-scene masks: reuses ep1/tools/mask.py's run() with jobs for public/img/samples images.
import sys
sys.path.insert(0, "/home/user/15minhistorystyle/projects/American_West/ep1/tools")
from mask import run  # noqa: E402
JOBS = {
    "s_montague": ("img/samples/spike_russell_1869.jpg", (1540, 1290, 1900, 2150), "isnet-general-use", 5000),
    "s_goliah": ("img/samples/hart_goliah_mirrored.jpg", (985, 280, 2104, 1340), "isnet-general-use"),
    "s_up": ("img/samples/carbutt_up_100th_1866.jpg", (0, 540, 920, 1200), "isnet-general-use"),
    "s_worker": ("img/samples/hart_tunnel8_worker.jpg", None, "hand-traced"),  # polygon only: traces/s_worker.json
    "s_redcloud": ("img/samples/red_cloud_trager_kuhn_1891.jpg", None, "u2net_human_seg"),
}
for n in sys.argv[1:] or JOBS:
    print(n, flush=True)
    try: run(n, *JOBS[n])
    except Exception as e: print("FAIL", n, e)
