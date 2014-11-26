// EmailService.js

var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: sails.config.project.nodemailer.auth
});

module.exports = {
  sendAlertEmail: function () {
    var mailOptions = {
      from: sails.config.project.nodemailer.sender, // sender address
      to: sails.config.project.nodemailer.mailToAlert, // send to self
      subject: 'New order created!', // Subject line
      html: '<p>You have new order.</p> Check your admin panel at <a href="' + sails.config.project.website + '/admin/' + '"></a> ' // html body
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) return console.log(err);
      else return console.log('Message sent: ' + info.response);
    });
  }
};
