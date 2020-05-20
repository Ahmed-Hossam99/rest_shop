const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const app = express();
// const {Mongo_Password} = require('./nodemon.json')
const productRouter = require('./api/routes/product')
const orderRouter = require('./api/routes/order')
const userRouter = require('./api/routes/user')
const morgan = require('morgan');

// mongoose setup=
mongoose.connect("mongodb+srv://AhmedHossam:01008453103@onlineshoping-iso7v.mongodb.net/rest", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log(err));


// morgan middleware
app.use(morgan('dev'))

// bodyParser Mideddleware
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
// app.use(expressValidator());

// make the file publically accessable 
app.use('/uploads', express.static('uploads'));



// Routes handlling requests
app.use('/product', productRouter)
app.use('/order', orderRouter)
app.use('/user', userRouter)

// ginerall mideelware 
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message
  res.status(status).json({ message: message, statusCode: status });
})

// Ensure Content Type
app.use('/', (req, res, next) => {
  // check content type
  let contype = req.headers['content-type'];
  if (contype && !((contype.includes('application/json') || contype.includes('multipart/form-data'))))
    return res.status(415).send({ error: 'Unsupported Media Type (' + contype + ')' });
  next();
});

// Error middleware 
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message
  })

})




module.exports = app;