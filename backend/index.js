import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Book } from './bookModel.js';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    return res.status(200).send('Hello World');
})

app.get('/books', async (req, res) => {
    try{
        const books = await Book.find();
        return res.status(200).json({
            count:books.length,
            data: books
        });
    }catch(error){
        return res.status(500).send(error.message);
    }
});

app.get('/books/:id', async (req,res) =>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: "Product not found"});
    }

    try{
        const books = await Book.findById(id);
    
        return res.status(200).json({
            count:books.length,
            data: books
        });

    }catch(error){
        return res.status(500).send("Server Error");
    }
});

app.put('/books/:id', async (req,res) =>{
    if(
        !req.body.title ||
        !req.body.author ||
        !req.body.publishYear
    ){
        return res.status(400).send('All fields are required');
    }

    const {id} = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: "Product not found"});
    }
    try{
        const book = await Book.findByIdAndUpdate(id, req.body, {new: true});
        return res.status(200).json({
            success: true,
            data: book
        });
    }catch(error){
        return res.status(500).send("Server Error");
    }

});

app.delete('/books/:id', async (req,res) =>{
    const{id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: "Product not found"});
    }
    try{
        await Book.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        });
    }catch(error){
        return res.status(500).send("Server Error");
    }
        
});

app.post('/books', async (req, res) => {
    try{ 
        if(
            !req.body.title ||
            !req.body.author ||
            !req.body.publishYear
        ){
            return res.status(400).send('All fields are required');
        }
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear
        };

        const book = await Book.create(newBook);
        return res.status(201).send(book);
    }
    catch(error){
        return res.status(500).send(error.message);
    }
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Database connected');
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log('Error connecting to database', error);
    })