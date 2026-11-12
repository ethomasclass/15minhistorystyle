# Hand traces

Polygons (lists of [x, y] in source pixels) for masks rembg cannot cut cleanly. Apply with `tools/refine_mask.py <name> --add/--sub/--keep/--only tools/traces/<file>.json`, and write each command here so the mask can be re-created. Mark the job in `tools/mask.py` "hand-traced: do not re-run".
