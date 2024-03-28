const controller = require('../controllers/user');
const router = require('express').Router();

router.post('/', controller.registerShopGroupManager);

module.exports = router;