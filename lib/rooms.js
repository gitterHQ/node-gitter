/* jshint node:true, unused:true */

var EventEmitter2 = require('eventemitter2').EventEmitter2;
var FayeClient    = require('./faye.js');

var Rooms = function(client, users) {
  this.client = client;
  this._users = users;
  this.path   = '/rooms';
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

Rooms.prototype.join = function(room_uri, cb) {
  var self = this;
  return this.client.post(this.path, {body: {uri: room_uri}})
  .then(function(res) {
    if (res.allowed) {
      return cb ? cb(null, self.extend(res.room)) : self.extend(res.room);
    } else {
      if (cb) { cb({err: 'Not allowed'}, null); } else { throw 'Not allowed'; }
    }
  });
};

// TODO CB
Rooms.prototype.sendMsg = function(id, message) {
  return this.client.post(this.path + '/' + id + '/chatMessages', {body: {text: message}});
};

Rooms.prototype.removeUser = function(userId, id) {
  return this.client.delete(this.path + '/' + id + '/users/' + userId);
};

Rooms.prototype.listenEvents = function(id, emitter) {
  this.client.stream(this.path + '/' + id + '/chatMessages', function(message) {
    emitter.emit('message', message);
  });
  return emitter;
};

['users', 'channels', 'chatMessages'].forEach(function(resource) {
  Rooms.prototype[resource] = function(id, query) {
    return this.client.get(this.path + '/' + id + '/' + resource, {query: query});
  };
});

Rooms.prototype.extend = function(room) {
  var self = this;

  ['users', 'channels', 'chatMessages'].forEach(function(resource) {
    room[resource] = function(query, cb) {
      return cb ? self[resource](room.id, query).nodeify(cb) : self[resource](room.id, query);
    };
  });

  room.send = function(message, cb) {
    return cb ? self.sendMsg(room.id, message).nodeify(cb) : self.sendMsg(room.id, message);
  };

  room.events = new EventEmitter2();
  room.events.setMaxListeners(Infinity);
  room.listen = function() {
    self.listenEvents(room.id, room.events);
    return room.events;
  };

  room.leave = function(cb) {
    return self._users.current().then(function (user) {
      return self.removeUser(user.id, room.id);
    }).nodeify(cb);
  };

  room.streaming = function() {
    if (!this._fayeClient) this._fayeClient = new FayeClient(room.id, self.client.token, {
      host: self.client.streamingEndpoint
    });

    return this._fayeClient;
  };

  return room;
};

module.exports = Rooms;
