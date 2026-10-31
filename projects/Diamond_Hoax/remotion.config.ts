import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setConcurrency(null); // let Remotion pick from available CPUs
// Use a preinstalled headless Chromium when one is present (cloud sessions); otherwise Remotion
// downloads its own.
if (process.env.REMOTION_CHROME) Config.setBrowserExecutable(process.env.REMOTION_CHROME);
// Windows PC: draw the 3D on the GPU. 600 frames of ch 5 took 22 s against 85 s in software, and frames compared the same.
if (process.platform === 'win32') Config.setChromiumOpenGlRenderer('angle');
