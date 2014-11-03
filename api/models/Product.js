/**
* Product.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    name: {
      type: 'STRING',
      required: true
    },
    thumbnail: {
      type: 'STRING',
    },
    photos: {
      type: 'ARRAY'
    },
    video: {
      type: 'STRING'
    },
    price: {
      type: 'FLOAT',
      required: true
    },
    description: {
      type: 'STRING'
    },
    stock: {
      type: 'INTEGER',
      defaultsTo: -1 // 0 인 경우 재고 없음 표시, -1인 경우 무한대
    },
    isSelling: {
      type: 'BOOLEAN',
      defaultsTo: false
    },
    related: {
      collection: 'Product',
      via: 'related'
    },
    tags: {
      type: 'ARRAY'
    },
    provider: {
      model: 'Provider'
    },
    category: {
      model: 'Category',
      // required: true
    },
  },

  beforeValidate: function (values, callback) {
    if ( isNaN(values.stock) ) {
      values.stock = -1;
    }

    if ( values.photos ) {
      var photosValue = [];
      var photoArray = values.photos[0].split(',');

      for ( var i in photoArray )
        photosValue.push(photoArray[i].trim());

      values.photos = photosValue;
    }

    if ( values.tags ) {
      var tagsValue = [];
      var tagsArray = values.tags[0].split(',');

      for ( var j in tagsArray )
        tagsValue.push(tagsArray[j].trim().toUpperCase());

      values.tags = tagsValue;
    }

    return callback();
  },
};

