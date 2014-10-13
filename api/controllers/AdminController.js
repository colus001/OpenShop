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

          next(null);
        });
      },

      function GetEditProduct (next) {
        if ( !req.params.hasOwnProperty('id') ) {
          next(null);
          return;
        }

        Product.findOne(req.params.id, function (err, product) {
          if (err) next (err);
          result.edit = product;

          next(null);
        });
      }
    ], function (err) {
      if (err) return res.serverError(err);

      return res.view('admin.product.html', result);
    });
  }
};