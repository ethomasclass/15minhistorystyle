# Hand traces and mask clean-ups

Masks that rembg could not cut cleanly are traced or corrected by hand here (points in source pixels). Re-create them with:

```
python3 tools/refine_mask.py polk --add tools/traces/polk_arm.json --sub tools/traces/polk_tidy.json --close 25 --smooth 5
python3 tools/refine_mask.py lincoln --add tools/traces/lincoln_hands.json --close 25 --smooth 5
python3 tools/refine_mask.py santa_anna --keep tools/traces/santa_anna_oval.json --close 15 --smooth 3
python3 tools/refine_mask.py signer --close 7 --smooth 1.5
python3 tools/refine_mask.py houston --only tools/traces/houston.json --close 0 --smooth 2.5
python3 tools/refine_mask.py huddle_santa_anna --only tools/traces/huddle_santa_anna.json --close 0 --smooth 1.2
python3 tools/refine_mask.py corkleg_leg --only tools/traces/corkleg_leg.json --close 0 --smooth 1.2
python3 tools/refine_mask.py jail_austin --only tools/traces/jail_austin.json --close 0 --smooth 0
python3 tools/refine_mask.py gonzales_flag --only tools/traces/gonzales_flag.json --close 0 --smooth 0
python3 tools/refine_mask.py gonzales_cannon --only tools/traces/gonzales_cannon.json --close 0 --smooth 0
python3 tools/refine_mask.py alamo_chapel --only tools/traces/alamo_chapel.json --close 0 --smooth 0
```

(polk, lincoln, santa_anna and signer start from a fresh `tools/mask.py <name>` run.) Then rebuild layers
(`tools/layers.py <name>`, with `LAYERS_FILL=paper` for engravings) and check every edge with `tools/mask_closeup.py`.
Entries in tools/mask.py marked "hand-traced" must not be re-run with rembg.
