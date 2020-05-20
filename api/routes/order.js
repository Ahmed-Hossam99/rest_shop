const express = require('express');
const router = express.Router();
const orderController = require('../controller/order')
const checkAuth = require('../middleware/check_auth')


router.get('/', checkAuth, orderController.getorder)
router.post('/', checkAuth, orderController.postorder)
router.get('/:orderId', checkAuth, orderController.getSingleOrder)
router.delete('/:ordertId', checkAuth, orderController.deleteOrder)

module.exports = router