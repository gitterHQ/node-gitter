'use strict';

var assert = require('assert');
var testUtils = require('../utils');

describe('unreads', function() {
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

  it("should list a user's unreads for a room", function() {
    return client.unreads.listForUserAndRoom(userId, roomId)
      .then(function(result) {
        assert(Array.isArray(result.chat));
        assert(Array.isArray(result.mention));
      });
  });

  it("should mark a user's unreads for a room", function() {
    return client.unreads.markForUserAndRoom(userId, roomId, {chat: ['foo']})
      .then(function(result) {
        assert.equal(result.success, true);
      });
  });
});
