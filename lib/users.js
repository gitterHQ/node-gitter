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

User.prototype.find = function(id) {
  return this.client.get(this.path + '/' + id);
};

User.prototype.rooms = function(id) {
  return this.client.get(this.path + '/' + id + '/rooms');
};

User.prototype.extend = function(user) {
  var self = this;

  user.rooms = function() {
    return self.rooms(user.id);
  };

  return user; 
};


module.exports = User;
