var Client = require('..');
var assert = require('assert');

describe('spread', function() {

  describe('default on', function() {
    var client;

    before(function() {
      client = new Client({ accessToken: process.env.GITTER_ACCESS_TOKEN, spread: true });
    });

    it('listForAuthUser', function() {
      return client.users.getAuthUser()
        .spread(function(user, response) {
          assert(user);
          assert(response);
          assert.strictEqual(response.statusCode, 200);
        });
    });

    it('listForAuthUser', function() {
      return client.users.getAuthUser({ spread: false })
        .then(function(user) {
          assert(user);
          assert(user.id);
        });
    });

  });

  describe('default off', function() {
    var client;

    before(function() {
      client = new Client({ accessToken: process.env.GITTER_ACCESS_TOKEN });
    });

    it('listForAuthUser', function() {
      return client.users.getAuthUser()
        .then(function(user) {
          assert(user);
          assert(user.id);
        });
    });

    it('listForAuthUser', function() {
      return client.users.getAuthUser({ spread: true })
        .spread(function(user, response) {
          assert(user);
          assert(response);
          assert.strictEqual(response.statusCode, 200);
        });
    });

  });

});
