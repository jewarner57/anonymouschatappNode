let chatrooms = './db/chatrooms.json';
let fs = require('fs');

async function joinChatroomById(roomObj, io) {
  let roomKey = roomObj.id;
  let inputPassword = roomObj.password;
  let roomPassword = '';
  let maxUsers = 10;
  let channel = '';

  let joinData = {
    id: 0,
    willJoin: false,
    status: 'Join Failed with Server Error.',
    roomAddress: '',
  };

  chatroomObj = JSON.parse(await fs.promises.readFile(chatrooms, 'utf8'));

  let rooms = chatroomObj.chatrooms;

  for (let i = 0; i < rooms.length; i++) {
    if (roomKey == rooms[i].id) {
      joinData.id = rooms[i].id;
      joinData.roomAddress = rooms[i].roomAddress;
      roomPassword = rooms[i].password;
      maxUsers = rooms[i].maxPopulation;
      channel = io.sockets.adapter.rooms[rooms[i].roomAddress];
    }
  }

  if (joinData.id === 0) {
    joinData.status = 'Chatroom ID is not valid.';
  } else if (inputPassword === roomPassword && channel.length < maxUsers) {
    joinData.status = 'Joined Room Successfully.';
    joinData.willJoin = true;
  } else if (roomPassword !== inputPassword) {
    joinData.status = 'The password you entered is not valid.';
  } else if (channel.length >= maxUsers) {
    joinData.status = 'Channel is Full.';
  }
  return joinData;
}

exports.joinChatroomById = joinChatroomById;
