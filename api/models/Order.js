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
    email: {
      type: 'EMAIL',
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
    comment: {
      type: 'STRING',
    },
    products: {
      type: 'JSON'
    },
    price: {
      type: 'FLOAT'
    },
    owner:{
      model: 'User'
    },
    shipping: {
      type: 'FLOAT'
    },
    payment: {
      type: 'STRING',
      enum: [ 'TRANSFER', 'CARD' ],
      required: true,
    },
    paymentCheck: {
      type: 'JSON'
    },
    paymentLog: {
      type: 'JSON'
    },
    delivery: {
      type: 'STRING'
    },
    status: {
      type: 'STRING', // PREPARE / SENT / DONE / CANCEL / SOLD-OUT
      enum: [ 'PREPARE', 'PAID', 'SENT', 'DONE', 'CANCEL', 'SOLD-OUT' ],
      defaultsTo: 'PREPARE'
    }
  }
};

