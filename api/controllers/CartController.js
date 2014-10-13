/**
 * CartController
 *
 * @description :: Server-side logic for managing carts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  index: function (req, res) {
    if ( !req.session.hasOwnProperty('cart') )
      req.session.cart = [];

    var products = req.session.cart;
    var cart = [];

    async.map(products, function (element, done) {
      Product.findOne(element.id, function (err, product) {
        if (err) done (err);
        if (!product)
          req.session.cart.splice(products.indexOf(element), 1);

        var prodcutInfo = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: element.quantity
        };

        cart.push(prodcutInfo);
        done(null, product);
      });
    }, function (err) {
      if (err) return res.serverError(err);

      var result = {
        total: 0,
        summary: 0,
        cart: cart
      };

      for ( var i in cart ) {
        result.summary += cart[i].price * cart[i].quantity;
        result.total += cart[i].quantity;
      }
      var view;

      return res.view('cart.html', result);
    });
  },

  add: function (req, res) {
    Product.findOne(req.params.id, function (err, product) {
      if (err) return res.serverError(err);
      if (!product) return res.serverError('NO_PRODUCT_FOUND');

      var quantity = ( req.query.hasOwnProperty('quantity') ) ? parseInt(req.query.quantity) : 1;

      AddToSessionCart(req.session, product.id, quantity);
      return res.send(req.session.cart);
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

  clear: function (req, res) {
    req.session.cart = [];
    return res.redirect('/');
  },

  buy: function (req, res) {
    Product.findOne(req.params.id, function (err, product) {
      if (err) return res.serverError(err);
      if (!product) return res.serverError('NO_PRODUCT_FOUND');

      var quantity = ( req.query.hasOwnProperty('quantity') ) ? parseInt(req.query.quantity) : 1;

      AddToSessionCart(req.session, product.id, quantity);
      return res.redirect('/cart')
    });
  },

  check: function (req, res) {

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