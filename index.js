const http = require('http'); 
require('dotenv').config();
const app = require("./app");

const port = process.env.port || 8888;

const server = http.createServer(app);

server.listen(port);