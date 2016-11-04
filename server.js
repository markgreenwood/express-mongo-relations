const app = require('./lib/app');
const http = require('http');
const port = process.env.PORT || 3000;

require('./lib/setup-mongoose');

const server = http.createServer(app);

server.listen(port, () => {
  console.log('Server running at ', server.address().address, ':', server.address().port);
});