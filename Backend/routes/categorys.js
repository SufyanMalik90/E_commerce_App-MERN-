const express = require('express');
const router = express.Router(); 
const {Category} = require('../models/category')

router.get(`/`, async (req, resp) => {
    const categorytList = await Category.find();
    
    if(!categorytList){
        resp.status(500).json({success: false}) //status
    }
    resp.status(200).send(categorytList)
})

router.get(`/:id`, async(req, resp)=>{
    const category = await Category.findById(req.params.id)
        if(!category){
           resp.status(404).json({success: false, message: 'Id not Found'})
        }
        else
        {
             resp.status(200).send(category);
        }
    
})

router.put(`/:id`, async(req, resp)=>{
    const category = await Category.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
    },
    {
        new: true
    })
        if(!category){
           resp.status(404).json({success: false, message: 'Id not Found'})
        }
        else
        {
             resp.status(200).send(category);
        }
    
})


router.post(`/`, async (req, resp) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save();
    

    if(!category){
        return resp.status(404).send('Category cannot be created')
    }
    resp.send(category);
    console.log('Record Inserted');
})

router.delete(`/:id`, (req, resp)=>{
    Category.findByIdAndRemove(req.params.id).then(category =>{
        if(!category){
            return resp.status(404).json({success: false, message: 'Id not Found'})
        }
        else
        {
            return resp.status(200).json({success: true, message: 'Id deleted'})
        }
    }).catch(err=>{
        return resp.status(400).json({success: false, error: err})
    })
})
module.exports = router;