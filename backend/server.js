const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

//Middlewares
app.use(express.json())
app.use(cors())

//connecting Mongodb
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
    console.log("DB Connected");
})
.catch((err)=>{
    console.log(err);
    
})

//creating mongodb schema
const todoSchema = mongoose.Schema({
    title:String,
    description:String,
    user:String
})

//creating mongodb Model
const todoModel = mongoose.model('Todo',todoSchema)

//create a collection in mongodb
app.post('/todos',async (req,res)=>{
    const{title,description,user} = req.body;
    try{
        const newTodo = new todoModel({title,description,user});
        await newTodo.save();
        res.status(201).json(newTodo);
    }catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }
})

//get items from mongo db
app.get('/todos',async(req,res)=>{
    try{
        const todos = await todoModel.find();
        res.json(todos);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }
    
})

//Update a todo item
app.put('/todos/:id',async(req,res)=>{
try {
    const{title,description} = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
        id,
        {title,description},
        {new:true} 
    )
    if (!updatedTodo) {
        return res.status(404).json({message:"Todo not Found"})
    }
    res.json(updatedTodo)
} catch (error) {
     console.log(error);
     res.status(500).json({message:error.message});
}
})

//Delete a Todo item
app.delete('/todos/:id',async(req,res)=>{
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
})

//Start the server
const port = 8000;
app.listen(port,()=>{
    console.log("Server Listening to the Port:"+port);
    
})