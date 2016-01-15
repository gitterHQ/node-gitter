var Client = require('../..');
var assert = require('assert');

describe('messages', function() {
  var client;
  var userId;
  var username;
  var roomId;

  before(function() {
    assert(process.env.GITTER_ACCESS_TOKEN, 'Please set GITTER_ACCESS_TOKEN');

    client = new Client({ accessToken: process.env.GITTER_ACCESS_TOKEN });

    return client.users.getAuthUser()
      .then(function(user) {
        userId = user.id;
        username = user.username;
        uri = username+'/test';
        return client.rooms.join({uri: uri})
      })
      .then(function(room) {
        roomId = room.id;
      });
  });

  it("should list the messages in a room", function() {
    return client.messages.listForRoom(roomId)
      .then(function(messages) {
        assert(Array.isArray(messages));
      });
  });

  it('should allow a user to create a message', function() {
    var text = "testing create message";
    return client.messages.create(roomId, {text: text})
      .then(function(message) {
        assert.equal(message.text, text);
      });
  });

  it('should allow a user to update a message', function() {
    var textCreate = "testing update message (before)";
    var textUpdate = "testing update message";
    return client.messages.create(roomId, {text: textCreate})
      .then(function(message) {
        assert.equal(message.text, textCreate);
        return client.messages.update(roomId, message.id, {text: textUpdate});
      })
      .then(function(message) {
        assert.equal(message.text, textUpdate);
      });
  });

  it('should stream the events in a room', function() {
    // TODO
  });

});
