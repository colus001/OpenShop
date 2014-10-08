/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	product: function (req, res) {
    Product.find({}, function (err, products) {
      var result = {
        products: products
      };

      return res.render('admin.product.html', result);
    });
  }
};

