/* jshint node:true, unused:true */

var Rooms = function(client) {
  this.client = client;
  this.path = '/rooms';
};

Rooms.prototype.findAll = function() {
  return this.client.get(this.path);
};

Rooms.prototype.find = function(id, cb) {
  var self = this;
  return this.client.get(this.path + '/' + id)
  .then(function(room) {
    return cb ? cb(null, self.extend(room)) : self.extend(room);
  });
};

Rooms.prototype.sendMsg = function(id, message) {
  return this.client.post(this.path + '/' + id + '/chatMessages', {text: message});
};

['users', 'channels', 'chatMessages'].forEach(function(resource) {
  Rooms.prototype[resource] = function(id) {
    return this.client.get(this.path + '/' + id + '/' + resource);
  };
});

Rooms.prototype.extend = function(room) {
  var self = this;

  ['users', 'channels', 'chatMessages'].forEach(function(resource) {
    room[resource] = function(cb) {
      return cb ? self[resource](room.id).nodeify(cb) : self[resource](room.id);
    };
  });

  room.send = function(message, cb) {
    return cb ? self.sendMsg(room.id, message).nodeify(cb) : self.sendMsg(room.id, message);
  };

  return room;
};


module.exports = Rooms;
