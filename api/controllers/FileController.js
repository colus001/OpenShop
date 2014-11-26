/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var adapter = 'skipper-' + sails.config.project.fileSystem;

module.exports = {
  index: function (req, res) {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
    '<form action="http://localhost:1337/file/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="image" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
    )
  },

  upload: function  (req, res) {
    var image = req.file('thumbnail');

    image.upload({
      adapter: require(adapter),
      key: sails.config.project.s3.key,
      secret: sails.config.project.s3.secret,
      bucket: sails.config.project.s3.bucket
    }, function (err, files) {
      if (err) return res.serverError(err);

      return res.json({
        message: files.length + ' file(s) uploaded successfully!',
        files: files
      });
    });
  },

  retrieve: function (req, res) {
    var blobAdapter = require(adapter)({
      uri: 'mongodb://localhost:27017/open-shop-images.product'
    });

    blobAdapter.read(req.params.id, function (err, files) {
      if (err) return res.serverError(err);

      res.send(files);
    });
  },

  test: function (req, res) {
    res.view('test.html');
  }
};