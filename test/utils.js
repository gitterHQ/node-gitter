var Client = require('..');

function setup() {
  client = new Client({ accessToken: process.env.GITTER_ACCESS_TOKEN });
  return client.users.getAuthUser()
    .then(function(user) {
      var userId = user.id;
      return client.rooms.listForUser(userId)
        .then(function(rooms) {
          var roomId = rooms[0].id;
          return [client, userId, roomId];
        });
    });
}

exports.setup = setup;
