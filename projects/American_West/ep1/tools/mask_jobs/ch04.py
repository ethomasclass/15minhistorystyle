# ch04 · The Mountain: mask jobs (merged into tools/mask.py's JOBS).
JOBS = {
    # foreground driller in the AI lithograph tunnel face (coral subject in the drilling beat)
    "c4_driller": ("img/ch04/ai_tunnel_face.jpg", (420, 280, 1060, 962), "isnet-general-use"),
    # Charles Crocker, Silas Selleck portrait (quiet section: teal trace only)
    "c4_crocker": ("img/ch04/crocker_selleck.jpg", None, "u2net_human_seg"),
}
JOBS.update({
    # AI lithograph props on white (weathered light), cut out for the desk
    "c4_drill_sledge": ("img/ch04/ai_prop_drill_sledge.jpg", None, "isnet-general-use", 4000),
    "c4_powder_keg": ("img/ch04/ai_prop_powder_keg.jpg", None, "isnet-general-use", 4000),
    "c4_nitro_can": ("img/ch04/ai_prop_nitro_can.jpg", None, "isnet-general-use", 4000),
})
