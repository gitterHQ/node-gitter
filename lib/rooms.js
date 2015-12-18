/* jshint node:true, unused:true */
'use strict';

var util   = require('util');
var EventEmitter = require('eventemitter3');
var Promise = require('bluebird');

var Room = function(attrs, client, faye) {
  EventEmitter.call(this);

  // API path to Room
  this.path = '/rooms';

  if (attrs)
    Object.keys(attrs).forEach(function(k) {
      this[k] = attrs[k];
    }.bind(this));

  if (typeof this.users !== 'function') {
    var users = this.users;
    this.users = function() {
      return Promise.resolve(users);
    };
  }

  this.client = client;
  this.faye   = faye;
};

util.inherits(Room, EventEmitter);

Room.prototype.findAll = function() {
  return this.client.get(this.path);
};

Room.prototype.find = function(id, cb) {
  var room = this.client.get(this.path + '/' + id)
  .then(function(roomData) {
    return new Room(roomData, this.client, this.faye);
  }.bind(this));
  return cb ? room.nodeify(cb) : room;
};

Room.prototype.join = function(room_uri, cb) {
  var room = this.client.post(this.path, {body: {uri: room_uri}})
  .then(function(roomData) {
    return new Room(roomData, this.client, this.faye);
  }.bind(this));
  return cb ? room.nodeify(cb) : room;
};

Room.prototype.send = function(message, cb) {
  var msg = this.client.post(this.path + '/' + this.id + '/chatMessages', {body: {text: message}});
  return cb ? msg.nodeify(cb) : msg;
};

Room.prototype.sendStatus = function(message, cb) {
  var msg = this.client.post(this.path + '/' + this.id + '/chatMessages', {body: {text: message, status: true}});
  return cb ? msg.nodeify(cb) : msg;
};

Room.prototype.removeUser = function(userId) {
  return this.client.delete(this.path + '/' + this.id + '/users/' + userId);
};

Room.prototype.listen = function() {
  this.client.stream(this.path + '/' + this.id + '/chatMessages', function(message) {
    this.emit('message', message);
  }.bind(this));
  return this;
};

['users', 'channels', 'chatMessages'].forEach(function(resource) {
  Room.prototype[resource] = function(query, cb) {
    var items = this.client.get(this.path + '/' + this.id + '/' + resource, { query: query });
    return cb ? items.nodeify(cb) : items;
  };
});

Room.prototype.subscribe = function() {
  this.subscriptions = ['chatMessages', 'events', 'users'].map(function(resource) {
    var resourcePath = '/api/v1/rooms/' + this.id + '/' + resource;
    return this.faye.client.subscribe(resourcePath, function(message) {
      this.emit(resource, message);
    }, this);
  }, this);

  return Promise.all(this.subscriptions);
};

Room.prototype.unsubscribe = Promise.method(function() {
  if (!this.subscriptions) return;

  return Promise.all(this.subscriptions.map(function(subscription) {
    return subscription.unsubscribe();
  }));

});

// DEPRECATED Rooms is now an event emitter and all you need is to
// subscribe() to start receiving events
Room.prototype.streaming = function() {
  this.subscribe();
  var fn = function() { return this; }.bind(this);

  return {
    chatMessages: fn,
    events: fn,
    users: fn,
    disconnect: function() { this.faye.disconnect(); }.bind(this)
  };
};

module.exports = Room;
