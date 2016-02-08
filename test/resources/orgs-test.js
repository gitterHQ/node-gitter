'use strict';

var assert = require('assert');
var testUtils = require('../utils');

describe('orgs', function() {
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

  it("should list a user's orgs", function() {
    return client.orgs.listForUser(userId)
      .then(function(orgs) {
        assert(Array.isArray(orgs));
      });
  });

});
