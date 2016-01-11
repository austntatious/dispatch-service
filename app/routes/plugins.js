/**
 * 3rd party plugins example routes.
 */

'use strict';

var router = require('express').Router(),
	pluginController  = require('../controllers/plugins');

router.get('/', pluginController.getPlugins);
router.get('/stripe', pluginController.getStripe);
router.post('/stripe', pluginController.postStripe);
router.get('/twilio', pluginController.getTwilio);
router.post('/twilio', pluginController.postTwilio);

module.exports = router;

