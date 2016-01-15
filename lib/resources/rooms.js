'use strict';

var Resource = require('tentacles/lib/Resource');
var method = Resource.method;

module.exports = Resource.extend({
  listForAuthUser: method({
    method: 'GET',
    path: '/v1/rooms'
  }),

  listUsers: method({
    method: 'GET',
    path: '/v1/rooms/:roomId/users',
    urlParams: ['roomId']
  }),

  listChannels: method({
    method: 'GET',
    path: '/v1/rooms/:roomId/channels',
    urlParams: ['roomId']
  }),

  join: method({
    method: 'POST',
    path: '/v1/rooms'
  })
});
