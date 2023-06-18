const express = require('express');
const router = express.Router();
const { Order } = require('../models/order')
const { OrderItem } = require('../models/order-Item')

router.get(`/`, async (req, resp) => {
    const orderList = await Order.find().populate('user', 'name').sort('dateOrdered');

    if (!orderList) {
        resp.status(500).json({ success: false }) //status
    }
    resp.send(orderList)
})

// search a single order by id
router.get(`/:id`, async (req, resp) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({ path: 'orderItem', populate: { path: 'product', populate: 'category' } });

    if (!order) {
        resp.status(500).json({ success: false }) //status
    }
    resp.send(order)
})


router.post(`/`, async (req, resp) => {

    const orderItemIds = Promise.all(req.body.orderItem.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }))

    const orderItemIdsResolverd = await orderItemIds;

    const totalPrices = await Promise.all(orderItemIdsResolverd.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0)
    console.log(totalPrice);

    const order = new Order({
        orderItem: orderItemIdsResolverd,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        totalPrice: totalPrice,
        user: req.body.user,
        status: req.body.status,

    })
    order.save().then((createOrder => {
        resp.status(201).json(createOrder)
        console.log('Record Inserted..');
    })).catch((err) => {
        console.log('Error Detected');
        resp.status(500).json({
            error: err,
            success: false
        })
    })

})

router.put(`/:id`, async (req, resp) => {
    const order = await Order.findByIdAndUpdate(req.params.id,
        {
            status: req.body.status
        },
        {
            new: true
        })
    if (!order) {
        resp.status(404).json({ success: false, message: 'Id not Found' })
    }
    else {
        resp.status(200).send(order);
    }

})

router.delete(`/:id`, (req, resp) => {
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if (order) {
            await order.orderItem.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return resp.status(200).json({ success: true, message: 'Id deleted' })
        }
        else {
            return resp.status(404).json({ success: false, message: 'Id not Found' })

        }
    }).catch(err => {
        return resp.status(400).json({ success: false, error: err })
    })
})

router.get(`/get/totalSales`, async (req, resp) => {
    const totalSales = await Order.aggregate([
        { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
    ])
    if (!totalSales) {
        return resp.status(400).send('Cannot get Total Sales')
    }
    return resp.send({
        totalsales: totalSales.pop().totalsales
    })
})

router.get(`/get/count`, async (req, resp) => {
    const orderList = await Order.countDocuments((count) => count)

    if (!orderList) {
        return resp.status(400).send('Cannot get User list')
    }
    return resp.send({
        count: orderList
    })
})
module.exports = router;