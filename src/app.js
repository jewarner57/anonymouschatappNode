const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const createChatroom = require('./createChatroom');
const joinChatroom = require('./joinChatroomById');
const findEmptyRooms = require('./findEmptyRooms');
const getRoomMaxUsers = require('./getRoomMaxUsers');

//Port from environment variable or default - 5000
const port = process.env.PORT || 5000;

//Setting up express and adding socketIo middleware
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//Setting up a socket with the namespace "connection" for new sockets
io.on('connection', (socket) => {
  socket.join('global', function () {
    io.in('global').emit('recieveRoomPopulation', {
      users: io.sockets.adapter.rooms['global'].length,
      maxUsers: '-',
    });
  });

  socket.on('sendGlobalMessage', (message) => {
    console.log('Global Chat: ', message.username + ': ' + message.body);
    socket.broadcast.to('global').emit('receiveGlobalMessage', {
      body: message.body,
      username: message.username,
    });
  });

  socket.on('createNewChatroom', async (settings) => {
    socket.leave('global');
    io.sockets.emit('updateRoomPopulation');

    let roomCode = await createChatroom.createChatroom(settings, socket.id);
    socket.join(roomCode.roomAddress);

    socket.emit('recieveChatroomCode', roomCode);
  });

  socket.on('joinChatroom', async (roomObj) => {
    socket.leave('global');
    io.sockets.emit('updateRoomPopulation');

    let joinRoom = await joinChatroom.joinChatroomById(roomObj, io);

    if (joinRoom.willJoin !== false) {
      socket.join(joinRoom.roomAddress);
      socket.emit('validateJoin', joinRoom);
    } else {
      socket.emit('joinError', joinRoom.status);
    }
  });

  socket.on('sendPrivateMessage', (message) => {
    socket.broadcast
      .to(message.roomAddress)
      .emit('recieve' + message.roomAddress, {
        body: message.body,
        username: message.username,
      });
  });

  socket.on('getRoomPopulation', async (roomInfo) => {
    let population = {
      users: io.sockets.adapter.rooms[roomInfo.roomAddress].length,
      maxUsers: await getRoomMaxUsers.getRoomMaxUsers(roomInfo.roomID),
    };

    io.in(roomInfo.roomAddress).emit('recieveRoomPopulation', population);
  });

  socket.on('disconnect', async () => {
    io.sockets.emit('updateRoomPopulation');
    await findEmptyRooms.findEmptyRooms(io);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
