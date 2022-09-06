import mongoose from 'mongoose';
import MongoDBContainer from './MongoDBContainer.js';

const collection = 'products';
const productsSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    code:String
})

export default class Products extends MongoDBContainer{
    constructor(){
        super(collection,productsSchema);
    }
    createCode = async()=>{
        let productFiltered;
        let createdCode ='';
        do{
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        for(let i=0; i<25; i++){
            createdCode += characters.charAt(Math.floor(Math.random()*characters.length))
        }
        productFiltered = await this.model.findOne({code:createdCode})
        }while(productFiltered===1)
        return createdCode
    };
    addProduct = async(product)=>{
        try {
            product.code= this.createCode();
            let result = await this.model.create(product);
            return result
        } catch (error) {
            console.log(`Cannot add product ${error}`)
        }
    }
}