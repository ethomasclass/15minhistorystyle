# Chapter 7 masks (merged into tools/mask.py's JOBS). Names are prefixed c7_.
JOBS = {
    # c7_ames, c7_babcock: refined after rembg (traces c7_ames_chair_sub/keep_upper, c7_babcock_keep_upper); re-apply them if re-run
    "c7_ames": ("img/ch07/oakes_ames_brady.jpg", (250, 300, 2300, 2900), "isnet-general-use"),
    "c7_colfax": ("img/ch07/colfax_brady.jpg", (200, 250, 2250, 2050), "u2net_human_seg"),
    "c7_babcock": ("img/ch07/babcock_brady.jpg", None, "u2net_human_seg"),
    "c7_grant": ("img/ch07/grant_brady_1870s.jpg", None, "u2net_human_seg"),
}
