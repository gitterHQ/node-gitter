var Client = require('..');
var assert = require('assert');

describe('extensions', function() {

  it('should allow extensions to be specified', function() {
    var client = new Client({
      extensions: [function(options, callback/*, next */) {
        /* Shortcut extension */
        callback(null, { statusCode: 200 }, { fakeUser: true });
      }]
    });

    return client.users.getAuthUser()
      .then(function(body) {
        assert.deepEqual(body, { fakeUser: true });
      });
  });

});
