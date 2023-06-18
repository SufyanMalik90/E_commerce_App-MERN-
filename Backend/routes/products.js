const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const { Products } = require('../models/product');
const mongoose = require('mongoose')

router.get(`/`, async (req, resp) => {

    let filter = {};
    if (req.query.categorys) {
        filter = { category: req.query.categorys.split(',') }
    }
    const productList = await Products.find(filter).populate('category')

    if (!productList) {
        resp.status(500).json({ success: false }) //status
    }
    resp.send(productList)
})

//Search Produc by ID

router.get(`/:id`, async (req, resp) => {
    const product = await Products.findById(req.params.id);

    if (!product) {
        resp.status(500).json({ success: false, message: 'Id not Found' }) //status
    }
    resp.send(product)
})

//Add New Product

router.post(`/`, async (req, resp) => {

    const category = await Category.findById(req.body.category);
    if (!category) return resp.status(400).send('Invalid Category');

    let product = new Products({
        name: req.body.name,
        description: req.body.description,
        richdescription: req.body.richdescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
        dateCreated: req.body.dateCreated,


    })
    product = await product.save();
    if (!product) {
        resp.status(400).send('Product Cannot be created');
    }
    resp.status(200).send(product);

})

//Update any Product
router.put(`/:id`, async (req, resp) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return resp.status(400).send('Invalid Id');
    } // check the valid id
    const category = await Category.findById(req.body.category);
    if (!category) return resp.status(400).send('Invalid Category');

    const product = await Products.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richdescription: req.body.richdescription,
            image: req.body.image,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
            dateCreated: req.body.dateCreated,
        },
        {
            new: true
        })
    if (!product) {
        resp.status(404).json({ success: false, message: 'Id not Found' })
    }
    else {
        resp.status(200).send(product);
    }

})

router.delete(`/:id`, (req, resp) => {
    Products.findByIdAndRemove(req.params.id).then(product => {
        if (!product) {
            return resp.status(404).json({ success: false, message: 'Id not Found' })
        }
        else {
            return resp.status(200).json({ success: true, message: 'Id deleted' })
        }
    }).catch(err => {
        return resp.status(400).json({ success: false, error: err })
    })
})

router.get(`/get/count`, async (req, resp) => {
    const productList = await Products.countDocuments((item) => item);

    if (!productList) {
        resp.status(500).json({ success: false }) //status
    }
    resp.send(productList)
})

router.get(`/get/featured/:count`, async (req, resp) => {

    const count = req.params.count ? req.params.count : 0
    const productList = await Products.find({ isFeatured: true }).limit(+count)

    if (!productList) {
        resp.status(500).json({ success: false }) //status
    }
    resp.send(productList)
})

module.exports = router;