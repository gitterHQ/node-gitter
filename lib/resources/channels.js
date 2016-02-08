
'use strict';

var Resource = require('tentacles/lib/Resource');
var method = Resource.method;

module.exports = Resource.extend({
  listForRoom: method({
    method: 'GET',
    path: '/v1/rooms/:roomId/channels',
    urlParams: ['roomId']
  }),

  listForUser: method({
    method: 'GET',
    path: '/v1/user/:userId/channels',
    urlParams: ['userId']
  })
});
