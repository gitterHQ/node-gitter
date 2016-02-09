'use strict';

var Resource = require('tentacles/lib/Resource');
var method = Resource.method;

module.exports = Resource.extend({
  listForUser: method({
    method: 'GET',
    path: '/v1/user/:userId/orgs',
    urlParams: ['userId']
  })
});
