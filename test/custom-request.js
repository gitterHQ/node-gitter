var Client = require('..');
var assert = require('assert');

describe('custom-request', function() {

  var client, mockRequest, count, sentBody;

  beforeEach(function() {
    count = 0;
  });

  it('should deal with json', function(done) {
    mockRequest = function(options, callback) {
      sentBody = { hello: 'cow' };
      count++;

      setImmediate(function() {
        callback(null, { statusCode: 200, headers: { 'content-type': 'application/json' }  }, JSON.stringify(sentBody) );
      });
    };

    client = new Client({ accessToken: process.env.GITTER_ACCESS_TOKEN, request: mockRequest });

    client.users.getAuthUser()
      .then(function(body) {
        assert.deepEqual(body, sentBody);
        assert.strictEqual(count, 1);
      })
      .nodeify(done);
  });

  it('should deal with objects', function(done) {
    mockRequest = function(options, callback) {
      sentBody = { hello: 'cow' };
      count++;

      setImmediate(function() {
        callback(null, { statusCode: 200, headers: { 'content-type': 'application/json' }  }, sentBody );
      });
    };

    client = new Client({ accessToken: process.env.GITTER_ACCESS_TOKEN, request: mockRequest });

    client.users.getAuthUser()
      .then(function(body) {
        assert.deepEqual(body, sentBody);
        assert.strictEqual(count, 1);
      })
      .nodeify(done);
  });

});
