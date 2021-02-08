const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    User = require('./models/user')

module.exports = (passport) => {
    var opts = {}
    opts.jwtFromRequest = (req) => {
        var token = null;
        if (req && req.cookies) {
            token = req.cookies['jwt'];
        }
        return token;
    };
    opts.secretOrKey = 'secret';
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log(jwt_payload)
        User.findOne({ _id: jwt_payload.sub }, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
}