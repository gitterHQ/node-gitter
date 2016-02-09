'use strict';

var Resource = require('tentacles/lib/Resource');
var method = Resource.method;

module.exports = Resource.extend({
  listForAuthUser: method({
    method: 'GET',
    path: '/v1/rooms'
  }),

  listForUser: method({
    method: 'GET',
    path: '/v1/user/:userId/rooms',
    urlParams: ['userId']
  }),

  join: method({
    method: 'POST',
    path: '/v1/rooms'
  })
});
