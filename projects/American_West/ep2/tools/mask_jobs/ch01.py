# Ch01 masks (builder ch01-03). The steer in Russell's "Waiting for a Chinook" (cropped from the postcard scan).
JOBS = {
    "ch01_steer": ("img/ch01/b_chinook_painting.jpg", (100, 360, 3020, 2100), "isnet-general-use"),
}
JOBS["ch01_russell"] = ("img/ch01/b_russell_c1900.jpg", None, "isnet-general-use")
JOBS.update({
    # the 1887 original (enlarged from the small scan, review/chinook_upscale/): the steer only, wolves excluded by the crop
    "c1_steer_1887": ("img/ch01/chinook_1887_restored.jpg", (1100, 650, 2700, 1800), "isnet-general-use"),
})
