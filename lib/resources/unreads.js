'use strict';

var Resource = require('tentacles/lib/Resource');
var method = Resource.method;

module.exports = Resource.extend({
  listForUserAndRoom: method({
    method: 'GET',
    path: '/v1/user/:userId/rooms/:roomId/unreadItems',
    urlParams: ['userId', 'roomId']
  }),

  markForUserAndRoom: method({
    method: 'POST',
    path: '/v1/user/:userId/rooms/:roomId/unreadItems',
    urlParams: ['userId', 'roomId']
  })
});
