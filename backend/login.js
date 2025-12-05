const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//Middlewares
const app = express();
app.use(express.json());
app.use(cors());

//Connect Mongodb
 mongoose.connect('mongodb://localhost:27017/Login-Page')
 .then(()=>{
    console.log("DB Connected Successfully");
 })
 .catch((err)=>{
    console.log(err);
})

//Create Schema
const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
})

//Create Model
const userModel = mongoose.model('user',userSchema)

//Create a Collection in DB
app.post('/login',async(req,res)=>{
    const{name,email,password} = req.body;
    try {
        const newUser = new userModel({name,email,password});
        await newUser.save();
        res.status(201).json(newUser);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
})



//connect server
const port = 8001;
app.listen(port,()=>{
    console.log("server Listening to the Port"+port);
    
})

