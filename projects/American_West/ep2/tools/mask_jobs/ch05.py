# ch05 (Who the Cowboys Were) masks: the coral subjects of their beats. Busts (Oct 27 rule): Ikard cropped to head and shoulders
# (c5_ikard_bust), Bass Reeves (already a bust). c5_ikard (full figure) and c5_vaquero (Remington, a painting of a rider) stay.
JOBS = {
    "c5_ikard": ("img/ch05/b_ikard_up.jpg", None, "isnet-general-use"),
    "c5_ikard_bust": ("img/ch05/b_ikard_up.jpg", None, "isnet-general-use", [(0, 420, 800, 976)]),
    "c5_reeves": ("img/ch05/bass_reeves_c1907.jpg", None, "isnet-general-use"),
    "c5_vaquero": ("img/ch05/remington_mexican_vaquero_1890.jpg", None, "isnet-general-use"),
}
# c5_reeves_bust (no job here): c5_reeves kept inside an ellipse (cx 960, cy 1450, rx 900, ry 1330 source px) so the photo's straight
# edges become a rounded bust, then re-traced with tools/trace.py's save(); holes filled in the alpha. Re-make it the same way if
# c5_reeves is ever re-run.
