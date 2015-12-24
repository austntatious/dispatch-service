/**
 * Split into declaration and initialization for better startup performance.
 */
var validator;
var cheerio;
var graph;
var foursquare;
var Twit;
var stripe;
var twilio;
var paypal;
var request;

var _ = require('lodash');
var async = require('async');
var querystring = require('querystring');

var secrets = require('../config/secrets');

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
 * GET /plugins/foursquare
 * Foursquare plugins example.
 */
exports.getFoursquare = function(req, res, next) {
  foursquare = require('node-foursquare')({ secrets: secrets.foursquare });

  var token = _.find(req.user.tokens, { kind: 'foursquare' });
  async.parallel({
    trendingVenues: function(callback) {
      foursquare.Venues.getTrending('40.7222756', '-74.0022724', { limit: 50 }, token.accessToken, function(err, results) {
        callback(err, results);
      });
    },
    venueDetail: function(callback) {
      foursquare.Venues.getVenue('49da74aef964a5208b5e1fe3', token.accessToken, function(err, results) {
        callback(err, results);
      });
    },
    userCheckins: function(callback) {
      foursquare.Users.getCheckins('self', null, token.accessToken, function(err, results) {
        callback(err, results);
      });
    }
  },
  function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('plugins/foursquare', {
      title: 'Foursquare plugins',
      trendingVenues: results.trendingVenues,
      venueDetail: results.venueDetail,
      userCheckins: results.userCheckins
    });
  });
};



/**
 * GET /plugins/facebook
 * Facebook plugins example.
 */
exports.getFacebook = function(req, res, next) {
  graph = require('fbgraph');

  var token = _.find(req.user.tokens, { kind: 'facebook' });
  graph.setAccessToken(token.accessToken);
  async.parallel({
    getMe: function(done) {
      graph.get(req.user.facebook, function(err, me) {
        done(err, me);
      });
    },
    getMyFriends: function(done) {
      graph.get(req.user.facebook + '/friends', function(err, friends) {
        done(err, friends.data);
      });
    }
  },
  function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('plugins/facebook', {
      title: 'Facebook plugins',
      me: results.getMe,
      friends: results.getMyFriends
    });
  });
};


/**
 * GET /plugins/twitter
 * Twiter plugins example.
 */
exports.getTwitter = function(req, res, next) {
  Twit = require('twit');

  var token = _.find(req.user.tokens, { kind: 'twitter' });
  var T = new Twit({
    consumer_key: secrets.twitter.consumerKey,
    consumer_secret: secrets.twitter.consumerSecret,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  T.get('search/tweets', { q: 'nodejs since:2013-01-01', geocode: '40.71448,-74.00598,5mi', count: 10 }, function(err, reply) {
    if (err) {
      return next(err);
    }
    res.render('plugins/twitter', {
      title: 'Twitter plugins',
      tweets: reply.statuses
    });
  });
};

/**
 * POST /plugins/twitter
 * Post a tweet.
 */
exports.postTwitter = function(req, res, next) {
  req.assert('tweet', 'Tweet cannot be empty.').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/plugins/twitter');
  }

  var token = _.find(req.user.tokens, { kind: 'twitter' });
  var T = new Twit({
    consumer_key: secrets.twitter.consumerKey,
    consumer_secret: secrets.twitter.consumerSecret,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  T.post('statuses/update', { status: req.body.tweet }, function(err, data, response) {
    if (err) {
      return next(err);
    }
    req.flash('success', { msg: 'Tweet has been posted.'});
    res.redirect('/plugins/twitter');
  });
};


/**
 * GET /plugins/stripe
 * Stripe plugins example.
 */
exports.getStripe = function(req, res) {
  stripe = require('stripe')(secrets.stripe.secretKey);

  res.render('plugins/stripe', {
    title: 'Stripe plugins',
    publishableKey: secrets.stripe.publishableKey
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
  twilio = require('twilio')(secrets.twilio.sid, secrets.twilio.token);

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


/**
 * GET /plugins/paypal
 * PayPal SDK example.
 */
exports.getPayPal = function(req, res, next) {
  paypal = require('paypal-rest-sdk');

  paypal.configure({
    mode: 'sandbox',
    client_id: secrets.paypal.client_id,
    client_secret: secrets.paypal.client_secret
  });

  var paymentDetails = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: secrets.paypal.returnUrl,
      cancel_url: secrets.paypal.cancelUrl
    },
    transactions: [{
      description: 'Hackathon Starter',
      amount: {
        currency: 'USD',
        total: '1.99'
      }
    }]
  };

  paypal.payment.create(paymentDetails, function(err, payment) {
    if (err) {
      return next(err);
    }
    req.session.paymentId = payment.id;
    var links = payment.links;
    for (var i = 0; i < links.length; i++) {
      if (links[i].rel === 'approval_url') {
        res.render('plugins/paypal', {
          approvalUrl: links[i].href
        });
      }
    }
  });
};

/**
 * GET /plugins/paypal/success
 * PayPal SDK example.
 */
exports.getPayPalSuccess = function(req, res) {
  var paymentId = req.session.paymentId;
  var paymentDetails = { payer_id: req.query.PayerID };
  paypal.payment.execute(paymentId, paymentDetails, function(err) {
    if (err) {
      res.render('plugins/paypal', {
        result: true,
        success: false
      });
    } else {
      res.render('plugins/paypal', {
        result: true,
        success: true
      });
    }
  });
};

/**
 * GET /plugins/paypal/cancel
 * PayPal SDK example.
 */
exports.getPayPalCancel = function(req, res) {
  req.session.paymentId = null;
  res.render('plugins/paypal', {
    result: true,
    canceled: true
  });
};
