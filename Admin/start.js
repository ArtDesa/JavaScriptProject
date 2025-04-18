//Imports Babel for access to modern ES6+ JavaScript
require('@babel/register')({})
//Imports and runs Server.js
module.exports = require('./Server')

/*Run node start.js to start the application while inside \Customer or \Admin folders.

To stop MongoDB server: 
If MongoDB server is running use this commadn to safely stop in from MongoDB Shell:
db.getSiblingDB('admin').shutdownServer()

This is you are doing it from inside Command Prompt or Powershell
mongo --eval "db.getSiblingDB('admin').shutdownServer()"



*/