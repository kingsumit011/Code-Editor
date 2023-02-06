import express from 'express';
const app = express();
const PORT = process.env.PORT||5000;
import { createServer } from 'http';
import { listen } from 'socket.io';

const httpServer = createServer(app)
const io = new Server(httpServer)

io.on('connection', (socket) => {   
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});





listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});