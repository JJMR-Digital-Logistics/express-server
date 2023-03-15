'use strict';

require('dotenv').config();
const { db } = require('./Models');
const server = require('./server.js');
const PORT = process.env.PORT || 3002;

db.sync().then(() => {
  server.start(PORT);
});
