/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

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
    mobile: {
      type: 'STRING'
    },
    address: {
      type: 'STRING'
    },
    postcode: {
      type: 'STRING'
    },
    permission: {
      type: 'STRING', // ADMIN, CUSTOMER
      defaultsTo: 'CUSTOMER'
    }
  },

  beforeCreate: function (values, callback) {
    async.waterfall([
      function genSalt (next) {
        bcrypt.genSalt(10, function(err, salt) {
          if (err) next(err);

          next(null, salt);
          return;
        });
      },

      function encrypt (salt, next) {
        bcrypt.hash(values.password, salt, function (err, hash) {
          if (err) next(err);
          values.password = hash;

          next(null);
          return;
        });
      }
    ], function (err, result) {
      if (err) return callback(err);

      callback();
      return;
    });
  },
};

