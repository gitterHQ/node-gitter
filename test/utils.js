var Client = require('..');

function setup() {
  client = new Client({ accessToken: process.env.GITTER_ACCESS_TOKEN });
  return client.users.getAuthUser()
    .then(function(user) {
      var userId = user.id;
      var uri = user.username + '/test';
      return client.rooms.join({uri: uri})
        .then(function(room) {
          var roomId = room.id;
          return [client, userId, roomId];
        });
    });
}

exports.setup = setup;
