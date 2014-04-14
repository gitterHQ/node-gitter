/* jshint node:true, unused:true */

var assert = require('assert');
var Gitter = require('../lib/gitter.js');

if (!process.env.TOKEN) {
  console.log('========================================');
  console.log('You need to provide a valid OAuth token:');
  console.log('$ TOKEN=<your_token> npm test');
  console.log('========================================\n');
  process.exit(1);
}

describe('Gitter Rooms', function() {
  var gitter;

  before(function() {
    gitter = new Gitter(process.env.TOKEN);
  });

  it('should find a room with cb', function(done) {
    gitter.rooms.find('529cd860ed5ab0b3bf04e29d', function(err, room) {
      assert.equal(room.name, 'malditogeek/vmux');
      done();
    });
  });

  it('should find a room', function(done) {
    gitter.rooms.find('529cd860ed5ab0b3bf04e29d').then(function(room) {
      assert.equal(room.name, 'malditogeek/vmux');
      done();
    });
  });

  it('should be able to send a message', function(done) {
    gitter.rooms.find('534bfb095e986b0712f0338e').then(function(room) {
      room.send('Time is ' + new Date()).then(function(message) {
        assert(message);
        done();
      });
    });
    
  });

  it('should fetch messages from a room', function(done) {
    gitter.rooms.find('529cd860ed5ab0b3bf04e29d').then(function(room) {
      room.chatMessages().then(function(messages) {
        assert(messages.length !== 0);
        done();
      });
    });
  });

  it('should fetch users in a room', function(done) {
    gitter.rooms.find('529cd860ed5ab0b3bf04e29d').then(function(room) {
      room.users().then(function(users) {
        assert(users.some(function(user) { return user.username === 'malditogeek'; }));
        done();
      });
    });
  });

  it('should fetch channels in a room', function(done) {
    gitter.rooms.find('529cd860ed5ab0b3bf04e29d').then(function(room) {
      room.channels().then(function(channels) {
        assert(channels.some(function(channel) { return channel.name === 'malditogeek/vmux/android'; }));
        done();
      });
    });
  });

});
