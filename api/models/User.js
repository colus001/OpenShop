/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

module.exports = {
  attributes: {
    name: {
      type: 'STRING',
    },
    email: {
      type: 'EMAIL',
      required: true,
      unique: true
    },
    password: {
      type: 'STRING',
      required: true
    },
    phone: {
      type: 'STRING'
    },
    address: {
      type: 'STRING'
    },
    postcode: {
      type: 'STRING'
    },
    orders: {
      collection: 'Order',
      via: 'owner'
    },
    provider: {
      model: 'Provider'
    },
    permission: {
      type: 'STRING',
      enum: [ 'ADMIN', 'CUSTOMER', 'PROVIDER' ],
      defaultsTo: 'CUSTOMER'
    }
  },

  beforeCreate: function (values, callback) {
    async.waterfall([
      function GenSalt (next) {
        bcrypt.genSalt(10, function(err, salt) {
          if (err) return next(err);

          return next(null, salt);
        });
      },

      function Encrypt (salt, next) {
        bcrypt.hash(values.password, salt, function (err, hash) {
          if (err) return next (err);
          values.password = hash;

          return next(null);
        });
      },

      function PutAdminPermission (next) {
        User.find({}, function (err, users) {
          if (err) return next (err);

          if ( users.length === 0 )
            values.permission = 'ADMIN';

          return next(null);
        });
      }
    ], function (err, result) {
      if (err) return callback(err);

      callback();
      return;
    });
  },
};

