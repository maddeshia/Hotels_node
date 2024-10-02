require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const passport = require('./auth');
const PORT =  3000;


// Database connections... with MongoDB
const uri = "mongodb://127.0.0.1:27017/Hotel_node"
mongoose.connect(uri)
        .then(()=> console.log("Connection Successful...."))
        .catch((err)=>console.log("err"));


app.use(bodyParser.json());

app.use(passport.initialize());


app.get('/', function(req, res){
    res.send('Welcome to our Hotel');
})


// Import the router files
const personRoutes = require('./routes/person.routes');
const menuItemRoutes = require('./routes/menu.routes');
  

// Use the routes
app.use('/person', personRoutes);
app.use('/menu', menuItemRoutes)


app.listen(PORT, ()=>{
    console.log(`listening on port: ${PORT}`);
})