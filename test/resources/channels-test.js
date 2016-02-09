'use strict';

var assert = require('assert');
var testUtils = require('../utils');

describe('channels', function() {
  var client;
  var userId;
  var roomId;

  before(function() {
    assert(process.env.GITTER_ACCESS_TOKEN, 'Please set GITTER_ACCESS_TOKEN');
    return testUtils.setup()
      .spread(function(_client, _userId, _roomId) {
        client = _client
        userId = _userId;
        roomId = _roomId;
      });
  });

  it("it lists a user's channels", function() {
    return client.channels.listForUser(userId)
      .then(function(channels) {
        assert(Array.isArray(channels));
      });
  });

  it('it lists the channels in a room', function() {
    return client.channels.listForRoom(roomId)
      .then(function(channels) {
        assert(Array.isArray(channels));
      });
  });

});
