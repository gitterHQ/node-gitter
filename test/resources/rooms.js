var Client = require('../..');
var assert = require('assert');

describe('rooms', function() {
  var client;
  var roomId;

  before(function() {
    assert(process.env.GITTER_ACCESS_TOKEN, 'Please set GITTER_ACCESS_TOKEN');

    client = new Client({ accessToken: process.env.GITTER_ACCESS_TOKEN });
    return client.rooms.listForAuthUser()
      .then(function(rooms) {
        roomId = rooms[0].id;
      });
  });

  it("should list the current user's rooms", function() {
    return client.rooms.listForAuthUser()
      .then(function(rooms) {
        assert(rooms[0].name);
      })
  });

  it('should list the users in a room', function() {
    return client.rooms.listUsers(roomId)
      .then(function(users) {
        assert(Array.isArray(users));
      })
  });

  it('should list the channels in a room', function() {
    return client.rooms.listChannels(roomId)
      .then(function(channels) {
        assert(Array.isArray(channels));
      })
  });

  it('should allow a user to join a room', function() {
    var uri = 'gitterHQ/gitter';
    return client.rooms.join({uri: uri})
      .then(function(room) {
        assert.equal(room.uri, uri);
      });
  });

});
