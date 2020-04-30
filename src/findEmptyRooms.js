const deleteRoom = require('./deleteRoom');
let chatrooms = './db/chatrooms.json';
var fs = require('fs');

async function findEmptyRooms(io) {
  chatroomObj = await JSON.parse(await fs.promises.readFile(chatrooms, 'utf8'));

  //If there is not a socket.adapter.room for the corresponding ID (nobody is in the room) then delete the room
  for (let i = 0; i < chatroomObj.chatrooms.length; i++) {
    if (!io.sockets.adapter.rooms[chatroomObj.chatrooms[i].id]) {
      await deleteRoom.deleteRoom(chatroomObj.chatrooms[i].id);
    }
  }
}
exports.findEmptyRooms = findEmptyRooms;
