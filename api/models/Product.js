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
    photos: {
      type: 'ARRAY'
    },
    price: {
      type: 'INTEGER',
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
    linked: {
      collection: 'Product',
      via: 'linked'
    },
    tags: {
      type: 'ARRAY'
    },
    // brand: {
    //   model: 'Brand'
    // },
    // category: {
    //   model: 'Category',
    //   required: true
    // },
  }
};

