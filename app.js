const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products');
const oderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://vladkoval_97:'+ process.env.MONGO_ATLAS_PW +'@node-rest-shop-rbclk.mongodb.net/test?retryWrites=true&w=majority', 

{
  //useMongoClient: true
  useNewUrlParser :true,
  useUnifiedTopology: true
});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads' , express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Acces-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers',
     "Origin, X-Requesr-With, Content-Type, Accept, Authorization");

     if(req.method === 'OPTIONS') {
         res.header('Acces-Control-Allow-Methods', 
         'PUT, POST, PATCH, DELETE, GET');
         return res.status(200).json({});

     }
     next();
});

//Routs witch should handle request
app.use('/products', productRoutes);
app.use('/orders', oderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);   
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    }); 
});

module.exports = app;