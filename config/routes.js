/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // INDEX
  'GET    /'                    : 'ProductController.list',
  'GET    /login'               : { view: 'login' },
  'GET    /account'             : { view: 'account'},

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  // ADMIN
  'GET    /admin'               : 'AdminController.index',
  'GET    /admin/product'       : 'AdminController.product',
  'GET    /admin/product/:id'   : 'AdminController.product',
  'GET    /admin/order'         : 'AdminController.order',
  'GET    /admin/user'          : 'AdminController.user',

  // USER
  'POST   /login'               : 'UserController.login',
  'POST   /signup'              : 'UserController.create',
  'POST   /reset'               : 'UserController.reset',
  'GET    /logout'              : 'UserController.logout',
  'GET    /profile'             : 'UserController.profile',

  // PRODUCT
  'GET    /product/:id'         : 'ProductController.view',
  'GET    /product/status/:id'  : 'ProductController.status',

  // ORDER & CART
  'GET    /cart'                : 'CartController.index',
  'PUT    /cart/apply/:id'      : 'CartController.apply',
  'GET    /cart/add/:id'        : 'CartController.add',
  'GET    /cart/buy/:id'        : 'CartController.add',
  'GET    /cart/clear'          : 'CartController.clear',
  'DELETE /cart/:id'            : 'CartController.delete',
  'GET    /checkout'            : 'CartController.checkout',

  'POST   /paid'                : 'OrderController.paid',
  'GET    /pay/:id'             : 'OrderController.pay',
  // 'GET    /order'               : 'OrderController.index',
  'GET    /order/cancel/:id'    : 'OrderController.cancel',
  'GET    /order/delivery/:id'  : 'OrderController.delivery',
  'GET    /order/check'         : 'OrderController.check',
  'GET    /order/change'        : 'OrderController.change',

  // FILE & UPLOAD
  'GET    /upload'              : 'FileController.upload',
  'GET    /image/:id'           : 'FileController.retrieve',
  'GET    /test'                : 'FileController.test',
};
