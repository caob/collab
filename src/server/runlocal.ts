

import * as svr from "./index";
svr.server.listen(svr.port);
console.log(`Listening on http://${svr.endpoint}:${svr.port}`);

