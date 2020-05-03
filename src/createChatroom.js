const uniqid = require('uniqid');
let chatrooms = './db/chatrooms.json';
var fs = require('fs');

async function createChatroom(settings, userId) {
  let password = settings.password;
  let maxUsers = settings.maxUsers;
  let token = Math.floor(Math.random() * Date.now());

  let newChatroom = {
    id: token,
    roomAddress: uniqid(),
    password: password,
    maxPopulation: maxUsers,
    timeCreated: new Date(),
  };

  let connectInfo = {
    id: token,
    roomAddress: newChatroom.roomAddress,
  };

  //empty chatroom.json file should contain: { "chatrooms": [] }
  fs.readFile(chatrooms, 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      let chatroomObj = JSON.parse(data);
      chatroomObj.chatrooms.push(newChatroom);
      chatroomObj = JSON.stringify(chatroomObj);

      fs.writeFile(chatrooms, chatroomObj, 'utf8', () => {});
    }
  });
  return connectInfo;
}

exports.createChatroom = createChatroom;
