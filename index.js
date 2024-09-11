import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import socketServerHandler from './routes/socket.js';

// load the environment variables from .evn file
connectDB();

// set the main application variables
const app    = express(); // used to config the routes
const server = createServer(app); // our server
const io     = new Server(server); // socket io server
const port   = process.env.PORT || 3000; // connection port

// middle ware to read the requests as json objects
app.use(express.json());

// handle the sockets server
socketServerHandler(io);

// respond to a request at '/' and return 'hello'
app.get('/', (req, res) => {
  res.send('Tic-Tac-Toe server is working.');
});

// set the server to listen to requests
server.listen(port, '0.0.0.0', () => {
  console.log(`Server Started on port ${port}`);
});