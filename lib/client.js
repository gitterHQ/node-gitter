/* jshint node:true, unused:true */

var https = require('https');
var Q     = require('q');


// TODO why aren't we using gzip?
//var zlib  = require('zlib');

var Client = function(token, opts) {
  this.version  = 'v1';
  this.token    = token;
  this.host     = opts.host || 'api.gitter.im';
  this.port     = opts.port || 443;
  this.prefix   = opts.prefix || false; // localhost /api
};

Client.prototype.get = function(path) {
  return this.request('GET', path);
};

Client.prototype.request = function(method, path) {
  var self = this;
  var defer = Q.defer();

  var headers = {
    'Authorization': 'Bearer ' + this.token,
    'Accept':        'application/json'
  };

  var opts = {
    host:     this.host,
    port:     this.port,
    method:   method,
    path:     '/' + this.version + path,
    headers:  headers,
  };

  console.log('[req] ', opts.path);

  var req = https.request(opts, function(res) {
    res.setEncoding('utf-8');

    self.rateLimit = res.headers['x-ratelimit-limit'];
    self.remaining = res.headers['x-ratelimit-remaining'];

    var data = '';
    res.on('data' , function(chunk) {
      data += chunk;
    });

    res.on('end', function() {

      // TODO handle posible errors in JSON parsing
      var body = JSON.parse(data);

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

  req.end();

  return defer.promise;
};

module.exports = Client;
