// Import server startup through a single index entry point

import './accounts.js';
import './browser-policy.js';
import './fixtures.js';
import './register-api.js';
//import method from  './methods';
import internalMongo from '../../api/remote/ddp';

internalMongo();
//method();
