/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var bcrypt = require('bcrypt');

module.exports = {
  profile: function (req, res) {
    var result = {};
    var skip = 0;
    var page = 1;

    if ( req.query.hasOwnProperty('page') ){
      skip = (req.query.page - 1) * 10;
      page = req.query.page;
    }

    var queryOptions = {
      where: {},
      skip: skip,
      limit: 10,
      sort: 'createdAt DESC'
    };

    result.page = page;

    async.waterfall([
      function GetTotalCount (next) {
        Order.count({ owner: req.session.user.id }, function (err, num) {
          if (err) return next (err);

          result.pages = [];

          for ( var i = 0, count = parseInt(num/queryOptions.limit); i <= count; i++ ) {
            result.pages.push(i+1);
          }

          return next(null);
        });
      },

      function GetUserAndOrders (next) {
        User.findOne(req.session.user.id).populate('orders', queryOptions).exec(function (err, user) {
          if (err) return next (err);
          if (!user) return next ('NO_USER_FOUND');

          result.user = user;
          result.cart = req.session.cart;
          result.orders = user.orders;

          return next(null);
        });
      }
    ], function (err) {
      if (err) return res.serverError (err);

      return res.view('profile.html', result);
    });
  },

	create: function (req, res) {
    User.create(req.body, function (err, user) {
      if (err) return next(err);

      return res.redirect('/');
    });
  },

  update: function (req, res) {
    delete req.body.email;

    console.log(req.body);

    User.update(req.params.id, req.body, function (err, user) {
      if (err) return res.serverError (err);

      return res.redirect('/profile');
    });
  },

  login: function (req, res) {
    async.waterfall([
      function GetUser (next) {
        User.findOne({ 'email': req.body.email }).exec(function (err, user) {
          if (err) return next(err);

          return next(null, user);
        });
      },

      function Validate (user, next) {
        bcrypt.compare(req.body.password, user.password, function(err, isSuccess) {
          if (err) return next(err);

          if ( isSuccess ) {
            req.session.authenticated = true;
            req.session.user = user;
          }

          return next(null, isSuccess);
        });
      }
    ], function (err, isSuccess) {
      if (err) return res.serverError(err);
      if ( !isSuccess ) return res.serverError('권한이 없거나. 비밀번호가 다릅니다.');

      return res.redirect('/');
    });
  },

  reset: function (req, res) {
    async.waterfall([
      function GetUser (next) {
        User.findOne({ 'email': req.body.email }).exec(function (err, user) {
          if (err) return next(err);

          return next(null, user);
        });
      },

      function GenSalt (user, next) {
        bcrypt.genSalt(10, function(err, salt) {
          if (err) return next(err);

          return next(null, user, salt);
        });
      },

      function Encrypt (user, salt, next) {
        var randomPassword = randomString(10);

        bcrypt.hash(randomPassword, salt, function (err, hash) {
          if (err) return next(err);

          user.update({ password: hash }, function (err, updatedUser) {
            updatedUser.newPassword = randomPassword;

            return next(null, updatedUser);
          });
        });
      },
    ], function (err, updatedUser) {
      // 수정이 필요함 - 미완성
      if (err) return res.serverError(err);
      if (!updatedUser.newPassword) return res.serverError();

      return res.return(updatedUser);
    });
  },

  logout: function (req, res) {
    req.session.authenticated = false;
    req.session.user = undefined;

    return res.redirect('/');
  },
};

function randomString(length, chars) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';

  for (var i = length; i > 0; --i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }

  return result;
}