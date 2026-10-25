# Mask jobs for chapter 3 (merged into tools/mask.py's JOBS). Run: python3 tools/mask.py ch03_crocker
JOBS = {
    "ch03_crocker": ("img/ch03/crocker_selleck.jpg", None, "u2net_human_seg"),
}
JOBS["ch03_tea_barrel"] = ("img/ch03/ai_tea_barrel_src.png", None, "isnet-general-use")
