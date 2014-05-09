/* jshint node:true, unused:true */

var assert = require('assert');
var Q = require('q');
var Gitter = require('../lib/gitter.js');

if (!process.env.TOKEN) {
  console.log('========================================');
  console.log('You need to provide a valid OAuth token:');
  console.log('$ TOKEN=<your_token> npm test');
  console.log('========================================\n');
  process.exit(1);
}

var yacht_room        = '534bfb095e986b0712f0338e';
var yacht_pub_channel = '534d120f5e986b0712f034be';

describe('Gitter Rooms', function() {
  var gitter;

  before(function() {
    gitter = new Gitter(process.env.TOKEN);
  });

  it('should find a room with cb', function(done) {
    gitter.rooms.find(yacht_room, function(err, room) {
      if (err) done(err);
      assert.equal(room.name, 'node-gitter/yacht');
      done();
    });
  });

  it('should find a room', function(done) {
    gitter.rooms.find(yacht_room).then(function(room) {
      assert.equal(room.name, 'node-gitter/yacht');
    }).nodeify(done);
  });

  it('should be able to join a room', function(done) {
    gitter.rooms.join('node-gitter/yacht').then(function(room) {
      assert.equal(room.name, 'node-gitter/yacht');
    }).nodeify(done);
  });

  it('should be able to leave a room', function(done) {
    this.timeout(10*1000);
    
    // Join the room first
    gitter.rooms.join('node-gitter/yacht').then(function(room) {
      return room.leave();
    }).then(function() {
      return gitter.currentUser();
    }).then(function(user) {
      return user.rooms();
    }).then(function(rooms) {
      var check = rooms.some(function(room) { return room.name === 'node-gitter/yacht'; });
      assert.equal(false, check);
    }).fin(function() {
      // Join the room again for the rest of the tests
      gitter.rooms.join('node-gitter/yacht');
    }).nodeify(done);
  });

  it('should not be able to join an invalid room', function(done) {
    gitter.rooms.join('some-invalid-room').then(function() {
    }).fail(function(err) {
      assert(err);
      done();
    }).fail(done);
  });

  it('should be able to send a message', function(done) {
    gitter.rooms.find(yacht_room).then(function(room) {
      return room.send('Time is ' + new Date());
    }).then(function(message) {
      assert(message);
    }).nodeify(done);
  });

  it('should fetch messages from a room', function(done) {
    gitter.rooms.find(yacht_room).then(function(room) {
      return room.chatMessages({limit: 5});
    }).then(function(messages) {
      assert(messages.length === 5);
    }).nodeify(done);
  });

  it('should fetch users in a room', function(done) {
    gitter.rooms.find(yacht_room).then(function(room) {
      return room.users();
    }).then(function(users) {
      assert(users.some(function(user) { return user.username === 'node-gitter'; }));
    }).nodeify(done);
  });

  it('should fetch channels in a room', function(done) {
    gitter.rooms.find(yacht_room).then(function(room) {
      return room.channels();
    }).then(function(channels) {
      assert(channels.some(function(channel) { return channel.name === 'node-gitter/yacht/pub'; }));
    }).nodeify(done);
  });

  it('should be able to listen on a room', function(done) {
    this.timeout(1000*5);

    var msg = '[streaming] ' + new Date();

    gitter.rooms.find(yacht_room).then(function(room) {
      var events = room.listen();

      events.on('message', function(message) {
        if (message.text === msg) {
          done();
        }
      });

      setTimeout(function() { room.send(msg); }, 500);
    }).fail(done);
  });

  it('should be able to subscribe to a room', function(done) {
    this.timeout(1000*5);

    var msg = '[faye] ' + new Date();

    gitter.rooms.find(yacht_room).then(function(room) {

      // Events snapshot 
      //var eventz = room.streaming().events();
      //eventz.on('snapshot', function(snapshot) {
      //  assert(snapshot.length !== 0);
      //});

      var events = room.streaming().chatMessages();

      events.on('snapshot', function(snapshot) {
        assert(snapshot.length !== 0);
      });

      events.on('chatMessages', function(message) {
        if (message.model.text === msg) {
          room.streaming().disconnect();
          done();
        }
      });

      setTimeout(function() { room.send(msg); }, 750);
    }).fail(done);
  });


  it('should post to multiple rooms', function(done) {
    this.timeout(1000*10);

    var fst_msg = 'ping at ' + new Date();
    var snd_msg = 'pong at ' + new Date();

    var fst_promise = gitter.rooms.find(yacht_pub_channel).then(function(room) {
      assert.equal(room.name, 'node-gitter/yacht/pub');
      return room;
    }).then(function(room) {
      room.send(fst_msg);
      return room;
    }).then(function(room) {
      return Q.delay(1000).then(function() {
        return room.chatMessages();
      });
    }).then(function(messages) {
      assert(messages.some(function(msg) { return msg.text === fst_msg; }));
    });

    var snd_promise = gitter.rooms.find(yacht_room).then(function(room) {
      assert.equal(room.name, 'node-gitter/yacht');
      return room;
    }).then(function(room) {
      room.send(snd_msg);
      return room;
    }).then(function(room) {
      return Q.delay(1000).then(function() {
        return room.chatMessages();
      });
    }).then(function(messages) {
      assert(messages.some(function(msg) { return msg.text === snd_msg; }));
    });

    Q.all([fst_promise, snd_promise]).nodeify(done);
  });

});
