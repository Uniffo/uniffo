import { classEngine } from './classes/engine/engine.ts';
import { session } from './services/session.ts';
import { uvm as uniffoVersionManager } from './services/uvm.ts';

const engine = new classEngine({ uniffoVersionManager, session });

await engine.exec(Deno.args);
