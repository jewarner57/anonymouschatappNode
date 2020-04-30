let chatrooms = './db/chatrooms.json';
var fs = require('fs');

async function deleteRoom(roomId) {
  chatroomObj = JSON.parse(await fs.promises.readFile(chatrooms, 'utf8'));

  let rooms = chatroomObj.chatrooms;

  for (let i = 0; i < rooms.length; i++) {
    if (roomId == rooms[i].id) {
      chatroomObj.chatrooms.splice(i, 1);
    }
  }

  fs.writeFile(chatrooms, JSON.stringify(chatroomObj), 'utf8', () => {});
}

exports.deleteRoom = deleteRoom;
