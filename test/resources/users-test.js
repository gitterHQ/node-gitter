'use strict';

var assert = require('assert');
var testUtils = require('../utils');

describe('users', function() {
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

  it('should get the authenticated user', function() {
    return client.users.getAuthUser()
      .then(function(user) {
        assert(user.username);
      })
  });

  it('should list the users in a room', function() {
    return client.users.listForRoom(roomId)
      .then(function(users) {
        assert(Array.isArray(users));
      })
  });
});
