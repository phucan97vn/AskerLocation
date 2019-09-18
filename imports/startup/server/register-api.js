/**
 * Register each api
 * import private server methods and server publications
 */

// users api
import '../../api/users/publications.js';
import '../../api/users/hooks.js';

// counters api (example)
import '../../api/counters/methods.js';
import '../../api/counters/publications.js';

// import marketing api
import '../../api/remote/asker-report-methods.js';
import '../../api/remote/asker-retention-methods';

//
import '../../api/remote/asker-location-methods';