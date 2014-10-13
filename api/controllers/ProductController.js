/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  view: function (req, res) {
    Product.findOne(req.params.id, function (err, product) {
      if (err) return res.serverError(err);
      if (!product) return res.serverError('NO_PRODUCT_FOUND');

      var result = {
        cart: req.session.cart,
        product: product
      }

      return res.view('product.html', result);
    });
  },

  list: function (req, res) {
    var result = {};

    async.waterfall([
      function GetCurrentUser (next) {
        if ( req.session.user_id == undefined )
          return next(null);

        User.findOne({ 'id': req.session.user_id }, function (err, user) {
          if (err) next(err);

          result.user = user;

          return next(null);
        });
      },

      function GetProductList (next) {
        Product.find({ isSelling: true }, function (err, products) {
          if (err) next(err);

          result.products = products;

          return next(null);
        });
      }
    ], function (err) {
      if (err) return res.serverError(err);

      if ( req.session.hasOwnProperty('cart') )
        result.cart = req.session.cart;
      else
        result.cart = [];

      return res.view('index.html', result);
    });
  },

  status: function (req, res) {
    Product.findOne(req.params.id, function (err, product) {
      if (err) return res.serverError(err);
      if (!product) return res.send('NO_PRODUCT_FOUND');

      product.isSelling = !product.isSelling;
      product.save(function (err, product) {
        if (err) return res.send(err);

        var result = {
          result: 'success',
          product: product
        };

        return res.json(result);
      });
    });
  },

  // update: function (req, res) {
  //   console.log(req.body);

  //   var id = req.body.edit;
  //   delete req.body.edit;

  //   Product.update(id, req.body, function (err, product) {
  //     if (err) return res.serverError(err);

  //     return res.json(product);
  //   });
  // }

  // create: function (req, res) {
  //   async.waterfall([
  //     function UploadThumbnail (next) {
  //       req.file('thumbnail').upload(function (err, thumbnail) {
  //         if (err) next(err);

  //         next(null, thumbnail);
  //         return;
  //       });
  //     },

  //     function SetProduct (thumbnail, next) {
  //       console.log('thumbnail:', thumbnail);

  //       req.body.thumbnail = thumbnail.files.fd;

  //       Product.create(req.body, function (err, product) {
  //         if (err) next(err);

  //         next(null, product);
  //         return;
  //       });
  //     }
  //   ], function (err, result) {
  //     if (err) res.serverError();

  //     res.json(result);
  //     return;
  //   });
  // }
};

