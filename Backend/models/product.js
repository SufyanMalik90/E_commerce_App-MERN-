const mongoose = require('mongoose');


const productsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,

    },
    richdescription: {
        type: String,
        default: '',
    },

    image: {
        type: String
    },
    images: [{
        type: String
    }],
    brand: {
        type: String
    },
    price: {
        type: Number
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0
    },
    rating: {
        type: Number
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

productsSchema.virtual('id').get(function () {
    return this._id.toHexString();    
})
productsSchema.set('toJSON', {
    virtuals: true,
})


exports.Products = mongoose.model('Products', productsSchema);