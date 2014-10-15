/**
 * CartController
 *
 * @description :: Server-side logic for managing carts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  index: function (req, res) {
    var result = {
      user: (req.session.hasOwnProperty('user')) ? req.session.user : undefined,
      total: 0,
      summary: 0
    };

    async.waterfall([
      function GetProduct(next) {
        if ( !req.session.hasOwnProperty('cart') )
          req.session.cart = [];

        var products = req.session.cart;
        var cart = [];

        async.map(products, function (item, done) {
          Product.findOne(item.id, function (err, product) {
            if (err) done (err);
            if (!product) {
              req.session.cart.splice(products.indexOf(item), 1);
              return done(null);
            }

            var prodcutInfo = {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: item.quantity
            };

            cart.push(prodcutInfo);
            return done(null, product);
          });
        }, function (err) {
          if (err) return res.serverError(err);

          result.cart = cart;

          for ( var i in cart ) {
            result.summary += cart[i].price * cart[i].quantity;
            result.total += cart[i].quantity;
          }

          return next(null, result);
        });
      }
    ], function (err, result) {
      if (err) return res.serverError (err);

      return res.view('cart.html', result);
    });
  },

  add: function (req, res) {
    Product.findOne(req.params.id, function (err, product) {
      if (err) return res.serverError(err);
      if (!product) return res.serverError('NO_PRODUCT_FOUND');

      var quantity = ( req.query.hasOwnProperty('quantity') ) ? parseInt(req.query.quantity) : 1;

      AddToSessionCart(req.session, product.id, quantity);
      return res.json(req.session.cart);
    });
  },

  apply: function (req, res) {
    var cart = req.session.cart;
    var id = req.params.id;
    var quantity = parseInt(req.query.quantity);

    for ( var i in cart ) {
      if ( cart[i].id == id ) {
        req.session.cart[i].quantity = quantity;
      }
    }

    return res.json(cart);
  },

  delete: function (req, res) {
    var cart = req.session.cart;
    var id = req.params.id;
    var quantity = parseInt(req.query.quantity);

    for ( var i in cart ) {
      if ( cart[i].id == id ) {
        req.session.cart.splice(i, 1);
      }
    }

    return res.json(cart);
  },

  clear: function (req, res) {
    req.session.cart = [];
    return res.redirect('/cart');
  },

  checkout: function (req, res) {
    var result = {
      user: (req.session.hasOwnProperty('user')) ? req.session.user : undefined,
      total: 0,
      summary: 0
    };

    async.waterfall([
      function GetCart (next) {
        if ( !req.session.hasOwnProperty('cart') || req.session.cart.length <= 0 ) {
          next('NO_PRODUCT_IN_CART');
          return;
        }

        var products = req.session.cart;
        var cart = [];

        async.map(products, function (item, done) {
          Product.findOne(item.id, function (err, product) {
            if (err) done (err);
            if (!product) done ('NO_PRODUCT_FOUND');
            if (product.stock === 0 || ( product.stock !== -1 && product.stock - item.quantity <= 0 )) done('SOLD_OUT');

            var prodcutInfo = {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: item.quantity
            };

            cart.push(prodcutInfo);
            done(null, product);
          });
        }, function (err) {
          if (err) return res.serverError(err);

          result.cart = cart;

          for ( var i in cart ) {
            result.summary += cart[i].price * cart[i].quantity;
            result.total += cart[i].quantity;
          }

          next(null, result);
          return;
        });
      }
    ], function (err, result) {
      if (err) return res.serverError(err);

      return res.view('checkout.html', result);
    });
  },

  // Disable default RESTful blueprint routes
  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  }
};


function AddToSessionCart (session, id, quantity) {
  var product = {
    id: id,
    quantity: quantity
  };

  if ( session.hasOwnProperty('cart') ) {
    var cart = session.cart;
    var isAlreadyExist = false;

    for ( var i in cart ) {
      if ( cart[i].id == id ) {
        session.cart[i].quantity += quantity;
        isAlreadyExist = true;
      }
    }

    if ( !isAlreadyExist )
      session.cart.push(product);
  } else {
    session.cart = [];
    session.cart.push(product);
  }
}