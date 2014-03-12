# Password hashing - pbkdf2 vs bcrypt vs scrypt
http://security.stackexchange.com/questions/4781/do-any-security-experts-recommend-bcrypt-for-password-storage
http://adambard.com/blog/3-wrong-ways-to-store-a-password/
http://www.reddit.com/r/PHP/comments/1c210u/opinions_on_password_safetybcryptscryptpbkdf2/
https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet
http://www.unlimitednovelty.com/2012/03/dont-use-bcrypt.html

# Sails with Obj-C:

https://github.com/fishrod-interactive/sails-io.objective-c

# Sails auth using external OAuth providers

https://github.com/stefanbuck/sails-social-auth-example/blob/master/config/middleware.js

# Sails with tokens

http://stackoverflow.com/questions/21447155/imaplementing-passport-http-bearer-token-with-sails-js

http://stackoverflow.com/questions/20506455/sails-js-with-passport-http-bearer-authentication-not-working

https://gist.github.com/robwormald/9441746

Use tokens instead of sessions for mobile apps
* Avoid requiring user to re-authenticate
* Store state info in token

[20:57:36] nownotrobdubya: noooo, whats the more elegant way to do it?
[20:57:36] robdubya tokens bro
[20:57:37] robdubya tokens
[20:57:46] robdubya sec
[20:57:56] nownot shit, so oauth2 from passport into mobile app?
[20:58:19] robdubya i mean, you could
[20:58:19] robdubyahttps://gist.github.com/robwormald/9441746
[20:58:29] robdubya i just exchange a username / password for a JWT
[20:58:34] nownot damn man :) thanks
[20:58:49] robdubya thats set up for sockets
[20:58:57] robdubya but same idea
[20:59:06] robdubya just have a middleware which verifies the token
[20:59:17] robdubya the other thing you can do is encode data into the token
[20:59:45] robdubyahttps://gist.github.com/robwormald/9441746#file-authcontroller-js-L27
[21:00:01] robdubya thats just embedding the user, but in theory you could encode all sorts of things
[21:00:08] robdubya note : not personal / private data
[21:02:20] nownot i take it jwt.sign does some db work? if not where / how are you storing tokens / verifying ?
[21:02:50] nownot but essentially this does the same thing as a session, does it not?
[21:03:18] robdubyanownot actually, there is no db work involved with the token really
[21:03:29] robdubya i chekc the password against the db when i issue it, yes
[21:06:20] robdubya but not necessarily when its in use
[21:06:20] robdubya the fact that it verifies means its legit
[21:06:20] robdubya eg, not expired, not tampered with
[21:06:20] nownot ok. but, and excuse my ignorance, how is this better than a session that is created by passport?
[21:06:58] robdubya well, sessions are sorta a pain the in ass
[21:07:15] robdubya and you necessarily have to go through that ui-webview baloney
[21:07:24] robdubya you can do this with pure ios
[21:07:36] robdubya post -> get token back, store it, use it for requests
[21:10:59] nownot but, and hear me out, doing this I have to write middleware and know when the tokens is bad, policies etc .... but using a web view, which using bootstrap and angular is already responsive, along with passportjs using sessions all that is there for me, already. I get back a bad response, not auth, then I know to re-login, when can actually be done with pure iOS, the login is just a post back so I can do that in code.
[21:11:17] nownot I'm missing the boat on why sessions suck and tokens are the way to go .... :/
[21:11:59] robdubya people don't like signging in on mobile apps
[21:12:08] robdubya its the worst ux experience ever
[21:12:11] nownot i agree with that
[21:12:47] robdubya my perspective, ymmv :
[21:13:00] robdubya i think in API terms
[21:13:09] robdubya APIs are stateless. or should be
[21:13:43] robdubya being logged into a webapp is one thing
[21:13:48] robdubya when its being served from a server
[21:13:52] robdubya sessions work there
[21:14:17] robdubya but i deploy to ios / droid / chrome packaged / web /etc
[21:14:38] robdubya it doesn't preclude you from using sessions
[21:15:11] robdubya but it guarantees that the functionality is more or less the same from everywhere
[21:15:20] nownot ahhhhh I see now, I'm dumb. The tokens are stored on the device. when you do a webcall its not vs an auth'd user, but rather a token.
[21:15:32] robdubya right
[21:15:40] nownot the tokens are always valid as long as they're not screwed with, no need to re auth
[21:16:16] nownot but they auth once, right?
[21:16:45] robdubya righ
[21:17:04] robdubya and depending on security requirments, device, whatever, you can do things like
[21:17:17] robdubya expire in 30 mins
[21:17:21] robdubya or expire in 30 years
