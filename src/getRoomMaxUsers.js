let chatrooms = './db/chatrooms.json';
let fs = require('fs');

async function getRoomMaxUsers(id) {
  chatroomObj = JSON.parse(await fs.promises.readFile(chatrooms, 'utf8'));

  let rooms = chatroomObj.chatrooms;
  let maxUsers = '-';

  for (let i = 0; i < rooms.length; i++) {
    if (id == rooms[i].id) {
      maxUsers = rooms[i].maxPopulation;
    }
  }

  return maxUsers;
}

exports.getRoomMaxUsers = getRoomMaxUsers;
