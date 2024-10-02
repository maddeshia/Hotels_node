const express = require('express');
const router = express.Router();
const MenuItem = require('./../models/Menuitem');


// POST method to add a menu Item
router.post('/items', async(req, res)=>{
    try {
        const data = req.body;
        const newMenu = new MenuItem(data);
        const response = await newMenu.save();
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server Error'});
    }
});


// Get method to get the Menu Items
router.get('/getItems', async(req,res)=>{
    try {
        const data = await MenuItem.find();
        console.log('data fetched');
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server Error'});
    }
});


router.get('/:taste', async(req, res)=>{
    try {
        const tasteType = req.params.taste;  // Extract the taste type from the URL parameter
        if (tasteType == 'sweet' || tasteType == 'sour' || tasteType == 'spicy') {
            const response = await MenuItem.find({taste: tasteType});
            console.log('response fetched');
            res.status(200).json(response);
        }else{
            res.status(404).json({error:'Invalid Taste type'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server Error'});
    }
});



router.put('/:id', async(req, res)=>{
    try {
        const menuId = req.params.id;  // Extract the id of menu item from the URL parameter
        const updatedMenuData = req.body;

        const response = await MenuItem.findByIdAndUpdate(menuId, updatedMenuData,{
            new:true,  // Return the Update document
            runValidators:true  // Run Mongoose validation
        })

        if (!response) {
            return res.status(404).json({error:'Menu Item not found'})
        }

        console.log('data fatched');
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server Errors'})
    }
});



router.delete('/:id', async(req,res)=>{
    try {
        const menuId = req.params.id;   // Extract the Menu id from the url Parameter

        // Assuming you have a menuitem model
        const response = await MenuItem.findByIdAndDelete(menuId);
        if (!response) {
            return res.status(200).json({msg:'Menu Item not found'});
        }
        console.log('data delete');
        res.status(404).json({msg:'Menu Deleted successful'});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'})
    }
});



// comment added for testing purposes
module.exports = router;