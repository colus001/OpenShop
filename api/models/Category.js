/**
* Category.js
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
    icon: {
      type: 'STRING',
      required: true
    },
    description: {
      type: 'STRING'
    },
    products: {
      collection: 'Product',
      via: 'category'
    }
  }
};

