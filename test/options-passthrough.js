var Client = require('..');
var assert = require('assert');

describe('options-passthrough', function() {

  var client, mockRequest, count, sentBody;

  beforeEach(function() {
    count = 0;
  });

  it('should passthrough custom options', function() {
    mockRequest = function(options, callback) {
      assert(!options.accessToken);
      assert.strictEqual(options.headers.Something, 'Else');
      assert.strictEqual(options.firstPageOnly, true);

      sentBody = { hello: 'cow' };
      count++;

      setImmediate(function() {
        callback(null, { statusCode: 200, headers: { 'content-type': 'application/json' }  }, JSON.stringify(sentBody) );
      });
    };

    client = new Client({ accessToken: process.env.GITTER_ACCESS_TOKEN, request: mockRequest, headers: { Something: 'Else' } });

    return client.users.getAuthUser({ firstPageOnly: true })
      .then(function(body) {
        assert.deepEqual(body, sentBody);
        assert.strictEqual(count, 1);
      });
  });

  it('should not passthrough filtered values', function() {
    mockRequest = function(options, callback) {
      assert(options.uri.indexOf('?q=123') > 0);
      assert(!options.url);
      assert.strictEqual(options.headers.Something, 'Else');
      assert.strictEqual(options.headers.X, 'Y');
      assert.strictEqual(options.firstPageOnly, '456');
      assert.strictEqual(options.gzip, true);
      assert(!options.query);
      assert(!options.accessToken);

      sentBody = { hello: 'cow' };
      count++;

      setImmediate(function() {
        callback(null, { statusCode: 200, headers: { 'content-type': 'application/json' }  }, JSON.stringify(sentBody) );
      });
    };

    client = new Client({ accessToken: process.env.GITTER_ACCESS_TOKEN, request: mockRequest, headers: { Something: 'Else' } });

    return client.users.getAuthUser({ query: { q: '123' }, firstPageOnly: '456', headers: { X: 'Y' }, gzip: false, url: 'bob' })
      .then(function(body) {
        assert.deepEqual(body, sentBody);
        assert.strictEqual(count, 1);
      });
  });


});
