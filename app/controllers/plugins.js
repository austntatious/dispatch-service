/**
 * Split into declaration and initialization for better startup performance.
 */
var validator,
cheerio,
graph,
Twit,
twilio,
request;

var _ = require('lodash');
var async = require('async');
var querystring = require('querystring');

var config = require('../../config/config');

/**
 * GET /plugins
 * List of plugins examples.
 */
exports.getPlugins = function(req, res) {
  res.render('plugins/index', {
    title: 'Plugin Examples'
  });
};


/**
 * GET /plugins/stripe
 * Stripe plugins example.
 */
exports.getStripe = function(req, res) {
  stripe = require('stripe')(config.stripe.secretKey);

  res.render('plugins/stripe', {
    title: 'Stripe plugins',
    publishableKey: config.stripe.publishableKey
  });
};

/**
 * POST /plugins/stripe
 * Make a payment.
 */
exports.postStripe = function(req, res, next) {
  var stripeToken = req.body.stripeToken;
  var stripeEmail = req.body.stripeEmail;
  stripe.charges.create({
    amount: 395,
    currency: 'usd',
    source: stripeToken,
    description: stripeEmail
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      req.flash('errors', { msg: 'Your card has been declined.' });
      res.redirect('/plugins/stripe');
    }
    req.flash('success', { msg: 'Your card has been charged successfully.' });
    res.redirect('/plugins/stripe');
  });
};

/**
 * GET /plugins/twilio
 * Twilio plugins example.
 */
exports.getTwilio = function(req, res) {
  twilio = require('twilio')(config.twilio.sid, config.twilio.token);

  res.render('plugins/twilio', {
    title: 'Twilio plugins'
  });
};

/**
 * POST /plugins/twilio
 * Send a text message using Twilio.
 */
exports.postTwilio = function(req, res, next) {
  req.assert('number', 'Phone number is required.').notEmpty();
  req.assert('message', 'Message cannot be blank.').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/plugins/twilio');
  }

  var message = {
    to: req.body.number,
    from: '+13472235148',
    body: req.body.message
  };
  twilio.sendMessage(message, function(err, responseData) {
    if (err) {
      return next(err.message);
    }
    req.flash('success', { msg: 'Text sent to ' + responseData.to + '.'});
    res.redirect('/plugins/twilio');
  });
};

