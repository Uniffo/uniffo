import { classUvm } from '../classes/uvm/uvm.ts';
import { gitHubApiClient } from './gh_api_client.ts';
import { session } from './session.ts';

/* `const uvm = new classUvm();` is creating a new instance of the `classUvm` class and assigning it to
the constant variable `uvm`. This allows you to access and use the methods and properties of the
`classUvm` class through the `uvm` variable. */
export const uvm = new classUvm({ gitHubApiClient, session });
