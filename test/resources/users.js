var Client = require('../..');
var assert = require('assert');

describe('users', function() {
  var client;
  var userId;
  var roomId;

  before(function() {
    assert(process.env.GITTER_ACCESS_TOKEN, 'Please set GITTER_ACCESS_TOKEN');

    client = new Client({ accessToken: process.env.GITTER_ACCESS_TOKEN });
    return client.users.getAuthUser()
      .then(function(user) {
        userId = user.id;
        return client.users.listRooms(userId);
      })
      .then(function(rooms) {
        roomId = rooms[0].id;
      });
  });

  it('should get the authenticated user', function() {
    return client.users.getAuthUser()
      .then(function(user) {
        assert(user.username);
      })
  });

  it("should list a user's rooms", function() {
    return client.users.listRooms(userId)
      .then(function(rooms) {
        assert(Array.isArray(rooms));
      });
  });

  it("should list a user's orgs", function() {
    return client.users.listOrgs(userId)
      .then(function(orgs) {
        assert(Array.isArray(orgs));
      });
  });

  it("should list a user's repos", function() {
    return client.users.listRepos(userId)
      .then(function(repos) {
        assert(Array.isArray(repos));
      });
  });

  it("should list a user's channels", function() {
    return client.users.listChannels(userId)
      .then(function(channels) {
        assert(Array.isArray(channels));
      });
  });

  it("should list a user's unreads for a room", function() {
    return client.users.listUnreadsForRoom(userId, roomId)
      .then(function(result) {
        assert(Array.isArray(result.chat));
        assert(Array.isArray(result.mention));
      });
  });

  it("should mark a user's unreads for a room", function() {
    return client.users.markUnreadsForRoom(userId, roomId, {chat: ['foo']})
      .then(function(result) {
        assert.equal(result.success, true);
      });
  });
});
