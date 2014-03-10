var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

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
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    console.log('Passport findOne', email, password);
    User.findOne({ email: email}).done(function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + email }); }
      if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
      return done(null, user);
    });
  }
));