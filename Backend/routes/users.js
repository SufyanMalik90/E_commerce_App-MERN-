const express = require('express');
const router = express.Router();
const { User } = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


router.get(`/`, async (req, resp) => {
    const userList = await User.find().select('-passwordHash');

    if (!userList) {
        resp.status(500).json({ success: false }) //status
    }
    resp.send(userList)
})

router.get(`/:id`, async (req, resp) => {
    const userList = await User.findById(req.params.id).select('-passwordHash');

    if (!userList) {
        resp.status(500).json({ success: false }) //status
    }
    resp.send(userList)
})


router.post(`/`, (req, resp) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,


    })
    user.save().then((createUser => {
        resp.status(201).json(createUser)
        console.log('Record Inserted..');
    })).catch((err) => {
        console.log('Error Detected');
        resp.status(500).json({
            error: err,
            success: false
        })
    })

})

router.post(`/login`, async (req, resp) => {
    const user = await User.findOne({ email: req.body.email })
    const userPass = await User.findOne({ passwordHash: req.body.passwordHash })

    if (!user) {
        return resp.status(400).send('Invalid Email')
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId : user.id
        },
        'secret',
        {expiresIn: '1w'}
        )
        return resp.status(200).send({user: user.email, token : token});
    }
    else {
        return resp.status(400).send('Invalid Pass')
    }

})

router.post(`/register`, (req, resp) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,


    })
    user.save().then((createUser => {
        resp.status(201).json(createUser)
        console.log('Record Inserted..');
    })).catch((err) => {
        console.log('Error Detected');
        resp.status(400).json({
            error: err,
            success: false
        })
    })

})

router.delete(`/:id`, (req, resp) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if (!user) {
            return resp.status(404).json({ success: false, message: 'Id not Found' })
        }
        else {
            return resp.status(200).json({ success: true, message: 'Id deleted' })
        }
    }).catch(err => {
        return resp.status(400).json({ success: false, error: err })
    })
})

router.get(`/get/count`, async (req, resp)=>{
    const userList = await User.countDocuments((count)=> count)

    if (!userList) {
        return resp.status(400).send('Cannot get User list')
    }
    return resp.status(200).send({
        count : userList
    })
})

module.exports = router;