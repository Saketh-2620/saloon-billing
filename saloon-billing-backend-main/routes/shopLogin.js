const controller = require('../controllers/user');
const router = require('express').Router();

router.post('/', controller.loginShopManager);

module.exports = router;