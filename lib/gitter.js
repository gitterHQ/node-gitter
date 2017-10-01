/* jshint node:true, unused:true */

var Client      = require('./client.js');
var Users       = require('./users.js');
var Rooms       = require('./rooms.js');
var FayeClient  = require('./faye.js');

var Gitter = function(token, opts) {
  opts = opts || {};
  
  try {
    token = token.replace(/\s+/g, '');

    if (token.length < 40) throw new Error();
  } catch(err) {
    return console.error('Token is not a string or isn\'t be 40 or more characters long.');
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
