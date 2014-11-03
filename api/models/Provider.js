/**
* Provider.js
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
    video: {
      type: 'STRING'
    },
    description: {
      type: 'STRING'
    },
    members: {
      collection: 'User',
      via: 'provider'
    },
    products: {
      collection: 'Product',
      via: 'provider'
    }
  }
};

