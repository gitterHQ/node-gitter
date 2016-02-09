'use strict';

var Resource = require('tentacles/lib/Resource');
var method = Resource.method;

module.exports = Resource.extend({
  listForRoom: method({
    method: 'GET',
    path: '/v1/rooms/:roomId/chatMessages',
    urlParams: ['roomId']
  }),

  create: method({
    method: 'POST',
    path: '/v1/rooms/:roomId/chatMessages',
    urlParams: ['roomId']
  }),

  update: method({
    method: 'PUT',
    path: '/v1/rooms/:roomId/chatMessages/:chatMessageId',
    urlParams: ['roomId', 'chatMessageId']
  }),

  streamForRoom: function() {
    // TODO
  }
});
