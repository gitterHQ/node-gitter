/* jshint node:true, unused:true */

var Rooms = function(client) {
  this.client = client;
  this.path = '/rooms';
};

Rooms.prototype.findAll = function() {
  return this.client.get(this.path);
};

Rooms.prototype.messages = function(id) {
  return this.client.get(this.path + '/' + id + '/chatMessages');
};

Rooms.prototype.users = function(id) {
   return this.client.get(this.path + '/' + id + '/users');
};

Rooms.prototype.channels = function(id) {
   return this.client.get(this.path + '/' + id + '/channels');
};

Rooms.prototype.extend = function(room) {
  var self = this;

  room.messages = function() {
    return self.messages(room.id);
  };

  room.users = function() {
    return self.users(room.id);
  };

  room.channels = function() {
    return self.channels(room.id);
  };

  return room;
};


Rooms.prototype.find = function(id) {
  var self = this;
  return this.client.get(this.path + '/' + id)
  .then(function(room) {
    return self.extend(room);
  });
};


module.exports = Rooms;
