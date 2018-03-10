const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const encryptLib = require('../modules/encryption');
const User = require('../models/User');
let verbose = true; // will show explanations in console.logs

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((result) => {
        // handle errors
        const user = result;

        if(!user){
            // user not found
            done(null, false, {message: 'Incorrect credentials.'});
        } else {
            // user found
            done(null, user);
        }
    }).catch((error) => {
        console.log('query error ', error);
        done(error);        
    });
});

// Does actual work of logging in
passport.use('local', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'username',
}, ((req, username, password, done) => {
    if (verbose) console.log('trying to log in:', username, password);
    User.find({ username })
        .then((result) => {
            const user = result && result[0];
            if (verbose) console.log('using comparePassword:', password, user.password);
            if (user && encryptLib.comparePassword(password, user.password)) {
                // all good! Passwords match!
                if (verbose) console.log('user found and passwords match');
                done(null, user);
            } else if (user) {
                // not good! Passwords don't match!
                if (verbose) console.log('bad creds');
                done(null, false, { message: 'Incorrect credentials.' });
            } else {
                // not good! No user with that name
                if (verbose) console.log('cannot find user');
                done(null, false);
            }
        }).catch((err) => {
            console.log('error', err);
            done(null, {});
        });
})));

module.exports = passport;
