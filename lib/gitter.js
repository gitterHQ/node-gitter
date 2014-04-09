/* jshint node:true, unused:true */

var Client  = require('./client.js');
var Users   = require('./users.js');
var Rooms   = require('./rooms.js');

var Gitter = function(token) {
  this.version  = 'v1';
  this.client   = new Client(token);
  this.rooms    = new Rooms(this.client);
  this.users    = new Users(this.client);
};

Gitter.prototype.currentUser = function(cb) {
  if (cb) {
    this.users.current().nodeify(cb);
  } else {
    return this.users.current();
  }
};

module.exports = Gitter;
