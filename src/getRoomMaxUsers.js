let chatrooms = './db/chatrooms.json';
let fs = require('fs');

async function getRoomMaxUsers(roomAddress) {
  if (roomAddress === 'global') {
    return '-';
  }

  chatroomObj = JSON.parse(await fs.promises.readFile(chatrooms, 'utf8'));

  let rooms = chatroomObj.chatrooms;
  let maxUsers = '-';

  for (let i = 0; i < rooms.length; i++) {
    if (roomAddress == rooms[i].roomAddress) {
      maxUsers = rooms[i].maxPopulation;
    }
  }

  return maxUsers;
}

exports.getRoomMaxUsers = getRoomMaxUsers;
