/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var SHIPPING_FEE = 3000;

module.exports = {
  // index: function (req, res) {

  // },

  findOne: function (req, res) {
    Order.findOne(req.params.id).populate('owner').exec(function (err, order) {
      return res.view('order.html', order);
      // return res.json(order);
    });
  },

  create: function (req, res)	{
    var result = {
      products: []
    };

    var order = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      postcode: req.body.postcode,
      comment: req.body.comment,
      payment: req.body.payment,
      shipping: req.body.shipping,
      price: 0,
      products: []
    }

    async.waterfall([
      function CheckOrder (next) {
        if ( !req.session.hasOwnProperty('cart') || req.session.cart.length <= 0 ) {
          next('NO_PRODUCT_FOUND');
          return;
        }

        var cart = req.session.cart;

        async.map(cart, function (item, done) {
          Product.findOne(item.id, function (err, product) {
            if (err) done (err);
            if (!product) done ('NO_PRODUCT_FOUND');
            if (!product.isSelling) done ('NOT_SELLING');

            order.price += product.price * item.quantity;
            product.quantity = item.quantity;
            order.products.push(product);

            done(null); return;
          });
        }, function (err) {
          if (err) next(err);

          if ( req.body.shipping === 'PRE' )
            order.price += SHIPPING_FEE;

          return next(null);
        });
      },

      function GetUser (next) {
        if ( !req.session.hasOwnProperty('user') ) {
          return next(null);
        }

        User.findOne(req.session.user.id, function(err, user) {
          if (err) next (err);
          if (!req.body.hasOwnProperty('remember') || !req.body.remember) {
            return next(null);
          }

          user.address = order.address;
          user.postcode = order.postcode;

          user.save(function (err, user) {
            result.user = user;

            order.owner = user.id;
            order.email = user.email;

            return next(null);
          });
        });
      },

      function CreateOrder (next) {
        Order.create(order, function (err, created) {
          if (err) next (err);

          result.order = created;

          return next(null);
        });
      }
    ], function (err) {
      if (err) return res.serverError(err);

      req.session.cart = [];

      return res.view('complete.html', result);
    });
  }
};

