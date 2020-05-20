const orderModel = require('../models/order')
const productModel = require('../models/product')

exports.getorder = (req, res, next) => {
  orderModel.find()
    .populate('product', 'name ')
    .then(orders => {
      const response = {
        count: orders.length,
        orders: orders.map(order => {
          return {
            product: order.product,
            quantity: order.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/order/' + order._id

            }
          }
        })
      }
      res.status(201).json(response)

    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postorder = (req, res, next) => {
  productModel.findById(req.body.productId)
    .then(product => {
      const order = new orderModel({
        product: req.body.productId,
        quantity: req.body.quantity,
      })
      return order.save()
        .then(order => {
          res.status(201).json({
            message: ' order requested   !!',
            OrderCreated: {
              product: order.product,
              quantity: order.quantity,
              request: {
                type: 'GET',
                url: 'http://localhost:3000/order'
              }
            }
          })
        })
        .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch(err => {
      if (!err.statusCode || err.message) {
        err.statusCode = 500;
        err.message = 'product not exist'
      }
      next(err);
    });
};

exports.getSingleOrder = (req, res, next) => {
  orderModel.findById(req.params.orderId)
    .populate('product', 'name price')
    .then(order => {
      if (!order) {
        const error = new Error('No order provided.');
        error.statusCode = 422;
        throw error;
      }
      res.status(201).json({
        product: order.product,
        quantity: order.quantity,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/order'
        }
      })

    })
    .catch(err => {
      if (!err.status) {
        err.status = 500
      }
      next(err)

    })

}

exports.deleteOrder = (req, res, next) => {
  const orderId = req.params.ordertId
  orderModel.deleteOne({ _id: orderId })
    .then(delorder => {
      res.status(201).json({
        message: 'order Deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/order',
          body: { orderId: 'object Type', quantity: 'Number' }
        },
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}
