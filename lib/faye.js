/* jshint node:true, unused:true */

var Faye = require('faye');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

// Authentication extension for Faye
var ClientAuthExt = function(token) {
  this.token = token;
};

ClientAuthExt.prototype.outgoing = function(message, callback) {
  if (message.channel == '/meta/handshake') {
    if (!message.ext) { message.ext = {}; }
    message.ext.token = this.token;
  }

  callback(message);
};

// Snapshot extension for Faye
var SnapshotExt = function(subscriptions) {
  this.subscriptions = subscriptions;
};

SnapshotExt.prototype.incoming = function(message, callback) {
  if(message.channel == '/meta/subscribe' && message.ext && message.ext.snapshot) {
    var sub = this.subscriptions[message.subscription];
    if (sub) sub.emitter.emit('snapshot', message.ext.snapshot);
  }

  callback(message);
};

// Client wrapper

var FayeClient = function(token, opts) {
  this.opts   = opts      || {};
  this.host   = opts.host || 'https://ws.gitter.im/faye';
  this.token  = token;

  this.subscriptions = {};

  this.client = new Faye.Client(this.host, {timeout: 60, retry: 5, interval: 1});
  this.client.addExtension(new ClientAuthExt(token));
  this.client.addExtension(new SnapshotExt(this.subscriptions));
};

['chatMessages', 'events', 'users'].forEach(function(resource) {
  FayeClient.prototype[resource] = function() {
    var resourcePath = '/api/v1/rooms/' + this.opts.roomId + '/' + resource;
    return this.subscribeTo(resourcePath, resource);
  };
});

FayeClient.prototype.subscribeTo = function(resource, eventName) {
  var emitter = new EventEmitter2();
  var subscription = this.client.subscribe(resource, function(msg) {
    emitter.emit(eventName, msg);
  });

  this.subscriptions[resource] = {
    eventName:      eventName,
    emitter:        emitter,
    subscription:   subscription
  };

  return emitter;
};

FayeClient.prototype.disconnect = function() {
  var self = this;

  Object.keys(this.subscriptions).forEach(function(sub) {
    self.subscriptions[sub].subscription.cancel();
    self.subscriptions[sub].emitter.removeAllListeners();
  });
};

module.exports = FayeClient;
