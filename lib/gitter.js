/* jshint node:true, unused:true */

var Client      = require('./client.js');
var Users       = require('./users.js');
var Rooms       = require('./rooms.js');
var FayeClient  = require('./faye.js');

var Gitter = function(token, opts) {
  opts = opts || {};
  
  token = token.trim();
  
  if (token.length !== 40) {
    console.warn('Token may not be valid, ' + token + '. Tokens are usually 40 character hex strings.');
  }
  
  this.client = new Client(token, opts.client);
  this.faye = new FayeClient(token, opts.faye);

  this.users = new Users(null, this.client, this.faye);
  this.rooms = new Rooms(null, this.client, this.faye, this.users);
};

Gitter.prototype.currentUser = function(cb) {
  return cb ? this.users.current().nodeify(cb) : this.users.current();
};

module.exports = Gitter;
