const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Products'
  },
  quantity: {
    type: Number,
    defult: 1
  }
})
module.exports = mongoose.model('Orders', orderSchema, 'Orders');