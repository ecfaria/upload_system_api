const app = require('./app');

/* 
  The server logic is not set on app.js because I want to be able to test the solution without the need to allocate a port everytime.
*/

app.listen(process.env.PORT || 3000);
