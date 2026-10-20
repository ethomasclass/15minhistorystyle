import {bundle} from '@remotion/bundler';
import {selectComposition} from '@remotion/renderer';
import path from 'node:path';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
for (const id of ['VShort1','VShort2']) { const c = await selectComposition({serveUrl, id, browserExecutable: process.env.REMOTION_CHROME||null}); console.log(id, (c.durationInFrames/30).toFixed(1)+'s', c.width+'x'+c.height); }
