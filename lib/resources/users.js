'use strict';

var Resource = require('tentacles/lib/Resource');
var method = Resource.method;

module.exports = Resource.extend({
  getAuthUser: method({
    method: 'GET',
    path: '/v1/user/me'
  }),

  listRooms: method({
    method: 'GET',
    path: '/v1/user/:userId/rooms',
    urlParams: ['userId']
  }),

  listOrgs: method({
    method: 'GET',
    path: '/v1/user/:userId/orgs',
    urlParams: ['userId']
  }),

  listRepos: method({
    method: 'GET',
    path: '/v1/user/:userId/repos',
    urlParams: ['userId']
  }),

  listChannels: method({
    method: 'GET',
    path: '/v1/user/:userId/channels',
    urlParams: ['userId']
  }),

  listUnreadsForRoom: method({
    method: 'GET',
    path: '/v1/user/:userId/rooms/:roomId/unreadItems',
    urlParams: ['userId', 'roomId']
  }),

  markUnreadsForRoom: method({
    method: 'POST',
    path: '/v1/user/:userId/rooms/:roomId/unreadItems',
    urlParams: ['userId', 'roomId']
  })
});
