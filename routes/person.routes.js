const express = require('express');
const router = express.Router();
const Person = require('./../models/Person');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');


// POST route to add a person
router.post('/signup', async(req,res)=>{
    try {
        const data = req.body;  // Assuming the request body contains the person data

        // Create a new person document using the mongodb model
        const newPerson = new Person(data);

        // Save the new person to the database
        const response = await newPerson.save();
        console.log('data saved');

        const payload = {
            id:response.id,
            username:response.username
        }
        console.log(JSON.stringify(payload));
        
        // Generate token
        const token = generateToken(payload);
        console.log('token is: ', token );

        res.status(200).json({response:response, token:token});
        
    } catch (error) {
        res.status(500).json({error:'Internal server error'})
    }
});




// Login Route
router.post('/login', async(req,res)=>{
    try {
        // Extract username and password from req body
        const {username, password} = req.body;

        // Find the user by username
        const user = await Person.findOne({username:username});

        // If user does't exist or password does't match, return err
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({error:'Invalid username or pass'})
        }

        // Generate Token
        const payload = {
            id:user.id,
            username:user.username
        }
        const token = generateToken(payload);

        // return token as response
        res.json({msg :"Login Successful",token});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server Error'})
    }
});



// Profile route
router.get('/profile', jwtAuthMiddleware, async(req, res)=>{
    try {
        const userData = req.user
        console.log('user data: ', userData);

        const userId = userData.id;
        const user = await Person.findById(userId);
        
        res.status(200).json({user});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server err'})
    }
});





// Get method to get the person
router.get('/', jwtAuthMiddleware, async(req, res)=>{
    try {
        const data = await Person.find();
        console.log('data fatched');
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'});
    }
});



//  Get method user worktypes[chef, waiter, manager]
router.get('/:workType', async(req, res)=>{
    try {
        // Extract the work type from the url parameter
        const workType = req.params.workType;
        if (workType == 'chef' || workType == 'manager' || workType == 'waiter') {
            const response = await Person.find({work:workType})
            console.log('response fetched');
            res.status(200).json(response)
        }else{
            res.status(404).json({error:'Invalid work type'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server err'});
    }
});



// Put method to the update user
router.put('/:id', async(req, res)=>{
    try {
        // Extract the id from the url parameter
        const personId = req.params.id;

        // Update data for the person
        const updatedPersonData = req.body;

        const response = await Person.findByIdAndUpdate(personId, updatedPersonData,{
            new:true,  // return the update document
            runValidators:true  // run mongoose validation
        })

        if (!response) {
            return res.status(404).json({error:'person not found'})
        }

        console.log('data updated');
        res.status(200).json(response);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server err'})
    }
});



// Delete method to the remove user id
router.delete('/:id', async(req, res)=>{
    try {
        //  Extract the person's id from the url parameter
        const personId = req.params.id;
        
        // Assuming you have a person model
        const response = await Person.findByIdAndDelete(personId);
        if (!response) {
            return res.status(404).json({error:'person not found'})
        }
        console.log('data deleted');
        res.status(200).json({msg:'person Deleted Successfully'})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server Errors'})
    }
});



module.exports = router;