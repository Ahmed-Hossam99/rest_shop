
const productModel = require('../models/product')
const path = require('path')
const fs = require('fs')

exports.getProduct = (req, res, next) => {
  productModel.find()
    .then(products => {
      const response = {
        count: products.length,
        products: products.map(prod => {
          return {
            name: prod.name,
            price: prod.price,
            imageUrl: prod.imageUrl,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/product/' + prod._id

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

// post add product
exports.postProduct = (req, res, next) => {
  if (!req.file) {
    const error = new Error('insert product image.');
    error.statusCode = 422;
    throw error;
  }
  else {
    req.file.path = 'http' + '://' + 'localhost:3000' + '/' + req.file.path;
  }
  const product = new productModel({
    name: req.body.name,
    imageUrl: req.file.path,
    price: req.body.price,
  })
  product.save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: ' Created Product !!',
        poductCreated: {
          name: result.name,
          price: result.price,
          imageUrl: result.imageUrl,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/product/' + result._id
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

};


// get Single Product
exports.getSingleProduct = (req, res, next) => {
  const productId = req.params.productId
  productModel.findById(productId)
    .then(product => {
      if (!product) {
        const error = new Error('No product provided.');
        error.statusCode = 422;
        throw error;
      }
      res.status(201).json({
        product: {
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/product',
          },
        }
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

}
// here i want ot add update image url 
exports.updateProduct = (req, res, next) => {
  const productId = req.params.productId
  // step One extract new data 
  const name = req.body.name
  const price = req.body.price
  let imageUrl = req.body.img
  if (req.file) {
    imageUrl = 'http' + '://' + 'localhost:3000' + '/' + req.file.path;

  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  productModel.findById(productId)
    .then(product => {
      if (!product) {
        const error = new Error('No product provided.');
        error.statusCode = 422;
        throw error;
      }
      // if pass new image i will delete old one 
      if (imageUrl !== product.imageUrl) {
        clearImage(product.imageUrl);
      }

      // step 2 pass new data 
      product.name = name;
      product.price = price;
      product.imageUrl = imageUrl

      product.save()

        .then(result => {
          console.log(result)
          res.status(201).json({
            message: 'product Updated !!',
            product: {
              name: result.name,
              price: result.price,
              imageUrl: result.imageUrl,
              request: {
                type: 'GET',
                url: 'http://localhost:3000/product/',
              },

            }
          })
        })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}




// delete Product
exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId
  productModel.deleteOne({ _id: productId })
    .then(delProd => {
      res.status(201).json({
        message: 'product Deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/product',
          body: { name: 'strng', price: 'Number', imageUrl: 'string' }
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

// to clear old image when update
const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};