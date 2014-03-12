var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
  console.log('Passport serializeUser', user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('Passport deserializeUser', id);
  User.findOneById(id).done(function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    console.log('Passport findOne', username, password);
    User.findOne({ username: username}).done(function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Unknown user ' + username });
      }
      bcrypt.compare(password, user.password, function(err, res) {
        if (!res)
          return done(null, false, {
            message: 'Invalid Password'
          });
        var returnUser = {
          username: user.username,
          createdAt: user.createdAt,
          id: user.id
        };
        return done(null, returnUser, {
          message: 'Logged In Successfully'
        });
      });
      // if (user.password != password) {
      //   return done(null, false, { message: 'Invalid password' });
      // }
      // return done(null, user);
    });
  }
));