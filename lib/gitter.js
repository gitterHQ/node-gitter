/* jshint node:true, unused:true */

var Client      = require('./client.js');
var Users       = require('./users.js');
var Rooms       = require('./rooms.js');
var FayeClient  = require('./faye.js');

var Gitter = function(token, opts) {
  opts = opts || {};

  this.client   = new Client(token, opts.client);
  this.users    = new Users(this.client);
  this.rooms    = new Rooms(this.client, this.users);
};

Gitter.prototype.currentUser = function(cb) {
  return cb ? this.users.current().nodeify(cb) : this.users.current();
};

Gitter.prototype.streamClient = function() {
  if (!this._fayeClient)
    this._fayeClient = new FayeClient(this.client.token, {host: this.client.streamingEndpoint});

  return this._fayeClient;
};

module.exports = Gitter;
