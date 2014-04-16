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
var SnapshotExt = function(emitters) {
  this.emitters = emitters;
};

SnapshotExt.prototype.incoming = function(message, callback) {
  if(message.channel == '/meta/subscribe' && message.ext && message.ext.snapshot) {

    // FIXME This is very fragile imho, if the Faye channels change this will break
    // Instantioate a new SnapshotExt for every resource? how?
    var resource = message.subscription.split('/')[5];
    this.emitters[resource].emit('snapshot', message.ext.snapshot);
  }

  callback(message);
};

// Client wrapper

var FayeClient = function(roomId, token, opts) {
  opts = opts || {};

  this.host     = opts.host || 'https://ws.gitter.im/faye';
  this.token    = token;
  this.roomId   = roomId;

  this.subscriptions = {};
  this.emitters      = {};

  var self = this;
  ['chatMessages', 'events', 'users'].forEach(function(resource) {
    self.emitters[resource] = new EventEmitter2();
  });

  this.client = new Faye.Client(this.host, {timeout: 60, retry: 5, interval: 1});
  this.client.addExtension(new ClientAuthExt(token));
  this.client.addExtension(new SnapshotExt(this.emitters));
};

['chatMessages', 'events', 'users'].forEach(function(resource) {
  FayeClient.prototype[resource] = function() {
    var self = this;
  
    this.subscriptions[resource] = this.client.subscribe('/api/v1/rooms/' + this.roomId + '/' + resource, function(msg) {
      self.emitters[resource].emit(resource, msg);
    });
  
    return this.emitters[resource];
  };
});

FayeClient.prototype.disconnect = function() {
  var self = this;

  Object.keys(this.subscriptions).forEach(function(sub) {
    self.subscriptions[sub].cancel();
  });

  Object.keys(this.emitters).forEach(function(emitter) {
    self.emitters[emitter].removeAllListeners();
  });
};

module.exports = FayeClient;
