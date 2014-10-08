/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
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
        Product.find({}, function (err, products) {
          if (err) res.serverError(err);

          result.products = products;

          return next(null);
        });
      }
    ], function (err) {
      if (err) res.serverError(err);

      return res.view('index.html', result);
    });
  }
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

