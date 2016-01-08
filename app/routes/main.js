/**
 * Main web app routes
*/ 

'use strict';

var router = require('express').Router(),
	passportConf  = require('../../config/passport'),
	mainController    = require('../controllers/main');

router.get('/', mainController.index);
router.get('/login', mainController.getLogin);
router.post('/login', mainController.postLogin);
router.get('/logout', mainController.logout);
router.get('/forgot', mainController.getForgot);
router.post('/forgot', mainController.postForgot);
router.get('/reset/:token', mainController.getReset);
router.post('/reset/:token', mainController.postReset);
router.get('/signup', mainController.getSignup);
router.post('/signup', mainController.postSignup);
router.get('/contact', mainController.getContact);
router.post('/contact', mainController.postContact);
router.get('/account', passportConf.isAuthenticated, mainController.getAccount);
router.post('/account/profile', passportConf.isAuthenticated, mainController.postUpdateProfile);
router.post('/account/password', passportConf.isAuthenticated, mainController.postUpdatePassword);
router.post('/account/delete', passportConf.isAuthenticated, mainController.postDeleteAccount);
router.get('/account/unlink/:provider', passportConf.isAuthenticated, mainController.getOauthUnlink);
router.get('/dashboard*', passportConf.isAuthenticated, mainController.getDashboard);

module.exports = router;
