const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const PORT = 5000;

require('dotenv/config');
const api = process.env.API_URL;

const productRouter = require('./routes/products');
const userRouter = require('./routes/users');
const orderRouter = require('./routes/orders');
const categoryRouter = require('./routes/categorys');




//middleware
app.use(bodyParser.json());

//routers
app.use(`${api}/products`, productRouter)
app.use(`${api}/users`, userRouter)
app.use(`${api}/orders`, orderRouter)
app.use(`${api}/category`, categoryRouter)



mongoose.set('strictQuery', false);
mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => {
        console.log('Database Connected..');
    })
    .catch((err) => {
        console.log(err);
    })
app.listen(PORT, () => {

    console.log(`Server is Running at PORT ${PORT}`);
})