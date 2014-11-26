/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var SHIPPING_FEE = 3000;

module.exports = {
  find: function (req, res) {
    return res.view('complete.html', { failed: true });
  },

  check: function (req, res) {
    Order.findOne(req.body.merchant_uid, function (err, order) {
      if (err) return res.serverError (err);

      if (!order) {
        sails.log ('ORDER_NOT_FOUND');
        return res.json({ confirm: false, message: 'ORDER_NOT_FOUND' });
      }

      if ( order.price !== amount ) {
        sails.log({ abuser: order.email });
        return res.json({ confirm: false, reason: 'PRICE_NOT_MATCH' });
      }

      return res.json({ confirm: true });
    });
  },

  paid: function (req, res) {
    sails.log('PAID:' + req.body);

    Order.findOne(req.body.merchant_uid, function (err, order) {
      if (err) return res.serverError (err);

      if (!order) {
        sails.log ('ORDER_NOT_FOUND');
        return res.json({ result: 'fail', message: 'ORDER_NOT_FOUND' });
      }

      order.status = 'PAID';

      if ( req.body.hasOwnProperty('apply_num') )
        order.paymentLog = req.body;
      else
        order.paymentCheck = req.body;

      order.save(function (err, saved) {
        if (err) sails.log (err);

        return res.json(saved);
      });
    });
  }, // iamport 서버 응답용

  change: function (req, res) {
    var result = GetSessionData(req);

    async.waterfall([
      function GetOrder (next) {
        Order.findOne(req.params.id, function (err, order) {
          if (err) return next (err);

          if ( req.query.hasOwnProperty('type') )
            order.status = req.query.type;

          return next(null, order);
        });
      },

      function SetOrder (order, next) {
        order.save(function (err, saved) {
          if (err) return next (err);

          result.order = saved;

          return next(null);
        });
      }
    ], function (err) {
      if (err) return res.serverError(err);

      res.redirect('/admin/order');
    });
  },

  findOne: function (req, res) {
    var result = GetSessionData(req);

    async.waterfall([
      function GetOrder (next) {
        Order.findOne(req.params.id).populate('owner').exec(function (err, order) {
          if (err) return next (err);

          result.order = order;

          return next(null);
        });
      }
    ], function (err) {
      if (err) return res.serverError(err);

      if ( req.query.hasOwnProperty('error') ) result.error = req.query.error.toUpperCase();

      return res.view('order.html', result);
    });

  },

  cancel: function (req, res) {
    var result = GetSessionData(req);

    async.waterfall([
      function GetOrder (next) {
        Order.findOne(req.params.id).populate('owner').exec(function (err, order) {
          if (err) return next (err);
          if (!order) return next ('NO_ORDER_FOUND');

          if (order.owner.id !== req.session.user.id)
            return next ('NO_PERMISSION');

          order.status = 'CANCEL';

          order.save(function (err, order) {
            if (err) return next (err);

            result.order = order;

            return next(null);
          });
        });
      }
    ], function (err) {
      if (err) return res.serverError (err);

      result.message = '주문을 취소하셨습니다.';

      return res.view('message.html', result);
    });
  },

  delivery: function (req, res) {
    var result = GetSessionData(req);

    async.waterfall([
      function GetOrder (next) {
        Order.findOne(req.params.id, function (err, order) {
          if (err) return next (err);

          if ( !order.hasOwnProperty('delivery') || order.delivery === undefined )
            return res.json({'message': '택배 번호가 없습니다.'});

          result.order = order;

          return next(null);
        });
      }
    ], function (err) {
      if (err) return res.serverError (err);

      result.message = '준비중입니다.';

      return res.json(result);
    });
  },

  pay: function (req, res) {
    var result = {
      user: (req.session.hasOwnProperty('user')) ? req.session.user : undefined,
      cart: (req.session.hasOwnProperty('cart')) ? req.session.cart : undefined
    }

    async.waterfall([
      function GetOrder (next) {
        Order.findOne(req.params.id).populate('owner').exec(function (err, order) {
          if (err) return res.serverError (err);
          if (order.status === 'PAID') return next('ALREADY_PAID');

          result.order = order;

          return next(null);
        });
      },
    ], function (err) {
      if (err) return res.redirect('/order/'+req.params.id+'?error='+err);

      return res.view('pay.html', result)
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
      shipping: 0,
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
            order.shipping = SHIPPING_FEE;

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
            req.session.user = user;

            return next(null);
          });
        });
      },

      function CreateOrder (next) {
        Order.create(order, function (err, created) {
          if (err) next (err);

          result.order = created;
          EmailService.sendAlertEmail();

          return next(null);
        });
      }
    ], function (err) {
      if (err) return res.serverError(err);

      req.session.cart = [];

      if ( result.order.payment === 'TRANSFER' ) return res.redirect('/account');

      return res.redirect('/pay/' + result.order.id);
    });
  }
};

function GetSessionData (req) {
  var result = {
    user: (req.session.hasOwnProperty('user')) ? req.session.user : undefined,
    cart: (req.session.hasOwnProperty('cart')) ? req.session.cart : undefined
  };

  return result;
}