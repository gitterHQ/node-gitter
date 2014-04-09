# Gitter API Client

```
var gitter = new Gitter(token);

gitter.currentUser()
.then(function(user) {
  console.log('You are: ', user.username);
  return user.rooms()
  .then(function(rooms) {
    console.log('Your rooms: ', rooms.length);
    done();
  });
});
```
