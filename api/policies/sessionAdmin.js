/**
 * sessionAdmin
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  if (req.session.hasOwnProperty('user')) {
    User.findOne(req.session.user.id, function (err, user) {
      if ( user.permission === 'ADMIN' ) {
        return next();
      }

      return res.redirect('/login');
    });
  }
};
