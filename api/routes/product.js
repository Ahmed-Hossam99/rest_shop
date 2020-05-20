const express = require('express');
const router = express.Router();
const productController = require('../controller/product')
const { multerConfigImage } = require('../services/multer')
const checkAuth = require('../middleware/check_auth')


router.get('/', productController.getProduct)
router.post('/', checkAuth, multerConfigImage, productController.postProduct)
router.get('/:productId', productController.getSingleProduct)
router.delete('/:productId', checkAuth, productController.deleteProduct)
router.put('/:productId', checkAuth, multerConfigImage, productController.updateProduct)


module.exports = router