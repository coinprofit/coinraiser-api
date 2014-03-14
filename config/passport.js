var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var bcrypt = require('bcrypt');

var AuthService = require('../api/services/AuthService');

passport.serializeUser(AuthService.serializeUser);
passport.deserializeUser(AuthService.deserializeUser);
passport.use(new LocalStrategy(AuthService.localStrategyHandler));
passport.use(new BearerStrategy(AuthService.bearerStrategyHandler));

// passport.serializeUser(function(user, done) {
//   // console.log('Passport serializeUser', user);
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   // console.log('Passport deserializeUser', id);
//   User.findOneById(id).done(function (err, user) {
//     done(err, user);
//   });
// });

// passport.use(new LocalStrategy({
//     usernameField: 'username',
//     passwordField: 'password'
//   },
//   function(username, password, done) {
//     console.log('Passport findOne', username, password);
//     User
//       .findOne({ username: username})
//       .done(function(err, user) {
//         if (err) {
//           return done(err);
//         }
//         if (!user) {
//           return done(null, false, { message: 'Invalid credentials' });
//           // return done(null, false, { message: 'Unknown user ' + username });
//         }
//         if(!user.validatePassword(password)) {
//           return done(null, false, { message: 'Invalid credentials' });
//           // return done(null, false, { message: 'Invalid password' });
//         }
//         return done(null, user);
//     });
//   }
// ));
