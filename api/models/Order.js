/**
* Order.js
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
    phone: {
      type: 'STRING',
      required: true
    },
    address: {
      type: 'STRING',
      required: true
    },
    postcode: {
      type: 'STRING',
      required: true
    },
    products: {
      collection: 'Product'
    },
    status: {
      type: 'STRING' // PREFARE / SENT / DONE / CANCEL / SOLD-OUT
    }
  }
};

