/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	product: function (req, res) {
    var result = {};

    async.waterfall([
      function GetAllProducts (next) {
        Product.find({}, function (err, products) {
          if (err) next (err);

          result.products = products;

          return next(null);
        });
      },

      function GetEditProduct (next) {
        if ( !req.params.hasOwnProperty('id') ) {
          return next(null);
          return;
        }

        Product.findOne(req.params.id, function (err, product) {
          if (err) next (err);
          result.edit = product;

          return next(null);
        });
      }
    ], function (err) {
      if (err) return res.serverError(err);

      return res.view('admin.product.html', result);
    });
  },

  order: function (req, res) {
    var result = {};

    async.waterfall([
      function GetAllOrders (next) {
        Order.find({}).sort({ 'createdAt': -1 }).populate('owner').exec(function (err, orders) {
          if (err) next (err);

          result.orders = orders;

          return next(null);
        });
      },

      function GetEditProduct (next) {
        if ( !req.params.hasOwnProperty('id') ) {
          return next(null);
        }

        Order.findOne(req.params.id, function (err, order) {
          if (err) next (err);
          result.edit = order;

          return next(null);
        });
      }
    ], function (err) {
      if (err) return res.serverError(err);

      // res.json(result);
      return res.view('admin.order.html', result);
    });
  }
};