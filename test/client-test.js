/* jshint node:true, unused:true */

var assert = require('assert');
var Gitter = require('../lib/gitter.js');

var token = 'b6c2cb1a9f5de80a9008d3fadea041203a5584ca';

describe('Gitter', function() {

  it('should fetch the current user', function(done) {
    var gitter = new Gitter(token);

    gitter.currentUser()
    .then(function(user) {
      assert.equal(user.username, 'malditogeek');
      done();
    })
    .fail(function(err) {
      console.log('err ', err);
    });
  });

  it('should fetch the current user cb', function(done) {
    var gitter = new Gitter(token);

    gitter.currentUser(function(err, user) {
      assert.equal(user.username, 'malditogeek');
      done();
    });
  });


  it('should fetch the current rooms', function(done) {
    var gitter = new Gitter(token);
    gitter.currentUser()
    .then(function(user) {
      return user.rooms()
      .then(function(rooms) {
        console.log('rooms: ', rooms.length);
        done();
      });
    });
  });


  it('should fetch messages from a room', function(done) {
    var gitter = new Gitter(token);
    gitter.rooms.find('533aa1485e986b0712f00ba5')
    .then(function(room) {
      return room.messages()
      .then(function(messages) {
        console.log('MSG: ', messages[0]);
        done();
      });
    });
  });

  it('should fail when fidning an invalid user', function(done) {
    var gitter = new Gitter(token);

    gitter.users.find('invalid')
    .then(function(user) {
    })
    .fail(function(err) {
      done();
    });
  });

});
