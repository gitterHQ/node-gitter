/* jshint node:true, unused:true */

var https = require('https');
var qs    = require('qs');
var Q     = require('q');

var DEBUG = process.env.DEBUG;

var Client = function(token, opts) {
  if (!opts) opts = {};

  this.token    = token;
  this.version  = opts.version || 'v1';
  this.host     = opts.host    || 'api.gitter.im';
  this.port     = opts.port    || 443;
};

['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach(function(method) {
  Client.prototype[method.toLowerCase()] = function(path, opts) {
    return this.request(method, path, opts);
  };
});

Client.prototype.request = function(method, path, opts) {
  opts = opts || {};
  var self = this;
  var defer = Q.defer();

  var headers = {
    'Authorization': 'Bearer ' + this.token,
    'Accept':        'application/json',
    'Content-Type':  'application/json'
  };

  var req_opts = {
    host:     this.host,
    port:     this.port,
    method:   method,
    path:     '/' + this.version + (opts.query ? path + '?' + qs.stringify(opts.query) : path),
    headers:  headers,
  };

  if (DEBUG) console.log('[req]', req_opts.method, req_opts.path);

  var req = https.request(req_opts, function(res) {
    res.setEncoding('utf-8');

    self.rateLimit = res.headers['x-ratelimit-limit'];
    self.remaining = res.headers['x-ratelimit-remaining'];

    var data = '';
    res.on('data' , function(chunk) {
      data += chunk;
    });

    res.on('end', function() {
      var body;
      try {
        body = JSON.parse(data);
      } catch(err) {
        defer.reject(res.statusCode + ' ' + data);
      }

      if (res.statusCode !== 200) {
        defer.reject(body);
      } else {
        defer.resolve(body);
      }
    });
  });

  req.on('error', function(err) {
    defer.reject(err);
  });

  if (opts.body) {
    req.write(JSON.stringify(opts.body));
  }

  req.end();

  return defer.promise;
};

Client.prototype.stream = function(path, cb) {
  var headers = {
    'Authorization': 'Bearer ' + this.token,
    'Accept':        'application/json',
    'Content-Type':  'application/json'
  };

  var opts = {
    host:     'stream.gitter.im',
    port:     443,
    method:   'GET',
    path:     '/' + this.version + path,
    headers:  headers,
  };

  if (DEBUG) console.log('[stream]', opts.method, opts.path);

  var heartbeat = " \n";

  var req = https.request(opts, function(res) {
    res.setEncoding('utf-8');

    res.on('data' , function(chunk) {
      var msg = chunk.toString();
      if (msg !== heartbeat) {
        var evt = JSON.parse(chunk);
        cb(evt);
      }
    });
  });

  req.on('error', function(err) {
    console.error('[stream]', err);
  });

  req.end();
};

module.exports = Client;
