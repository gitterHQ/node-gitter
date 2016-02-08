'use strict';

var assert = require('assert');
var testUtils = require('../utils');

describe('rooms', function() {
  var client;
  var userId;
  var roomId;

  before(function() {
    assert(process.env.GITTER_ACCESS_TOKEN, 'Please set GITTER_ACCESS_TOKEN');
    return testUtils.setup()
      .spread(function(_client, _userId, _roomId) {
        client = _client;
        userId = _userId;
        roomId = _roomId;
      });
  });

  it("should list the current user's rooms", function() {
    return client.rooms.listForAuthUser()
      .then(function(rooms) {
        assert(rooms[0].name);
      })
  });

  it('should allow a user to join a room', function() {
    var uri = 'gitterHQ/gitter';
    return client.rooms.join({uri: uri})
      .then(function(room) {
        assert.equal(room.uri, uri);
      });
  });

  it("should list a user's rooms", function() {
    return client.rooms.listForUser(userId)
      .then(function(rooms) {
        assert(Array.isArray(rooms));
      });
  });
});
