# Ch08 masks (builder of ch07-10): name -> (source in public/, crop or None, rembg model)
JOBS = {
    "b_glidden_poster": ("img/ch08/glidden_barb_wire_poster_c1877.jpg", (300, 400, 890, 1000), "isnet-general-use"),
    "b_gates": ("img/ch08/b_gates_engraving.jpg", None, "isnet-general-use"),
}
