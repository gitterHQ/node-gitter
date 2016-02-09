'use strict';

var Resource = require('tentacles/lib/Resource');
var method = Resource.method;

module.exports = Resource.extend({
  getAuthUser: method({
    method: 'GET',
    path: '/v1/user/me'
  }),

  listForRoom: method({
    method: 'GET',
    path: '/v1/rooms/:roomId/users',
    urlParams: ['roomId']
  })
});
