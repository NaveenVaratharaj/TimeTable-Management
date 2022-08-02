require('dotenv').config
const passport = require("passport")
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
    clientID:     "410802845645-d208vqjrr8lhh8sb2k2u9pl5kqhdtu1r.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:4000/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
));

passport.serializeUser(function (user,done){
    done(null, user)
});

passport.deserializeUser(function (user,done){
    done(null, user)
});
