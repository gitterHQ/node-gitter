/* jshint node:true, unused:true */

var User = function(client) {
  this.client = client;
  this.path   = '/user';
};

User.prototype.current = function() {
  var self = this;

  return this.client.get(this.path)
  .then(function(users) {
    var user = users[0];
    return self.extend(user);
  });
};

User.prototype.find = function(id, cb) {
  var path = this.path + '/' + id;
  return cb ? this.client.get(path).nodeify(cb) : this.client.get(path);
};

['rooms', 'repos', 'orgs', 'channels'].forEach(function(resource) {
  User.prototype[resource] = function(id, query) {
    return this.client.get(this.path + '/' + id + '/' + resource, {query: query});
  };
});

User.prototype.extend = function(user) {
  var self = this;

  ['rooms', 'repos', 'orgs', 'channels'].forEach(function(resource) {
    user[resource] = function(query, cb) {
      return cb ? self[resource](user.id, query).nodeify(cb) : self[resource](user.id, query);
    };
  });

  return user; 
};

module.exports = User;
