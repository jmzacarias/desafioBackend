import mongoose from 'mongoose';
import MongoDBContainer from './MongoDBContainer.js';
import Products from './Products.js';

const productsService = new Products()

const collection = 'carts';
const cartsSchema = mongoose.Schema({
    products:{
        type:Array,
        default:[],
    },
},{timestamps:true})

export default class Carts extends MongoDBContainer{
    constructor(){
        super(collection,cartsSchema)
    }
    create = async () => {
        try {
            let cart={}
            let result = await this.save(cart)
            return result
        } catch (error) {
            console.log(`Cannot create new cart : ${error}`)
        }
    }
    addProduct = async(product,cid)=>{
        try {
            let cart = await this.getById(cid);
            let products = await productsService.getAll();
            let productIndex
            if(product.name){
                productIndex = products.findIndex(e=>e.name==product.name);
                if(productIndex==-1){console.log('Product is not available')}
            }else{
                productIndex = products.findIndex(e=>e.id===product.id); 
                if(productIndex == -1){console.log('Product is not available')}
            }
            let productInCartIndex = cart.products.findIndex(item=>item.id===products[productIndex].id)
            if(cart.products[productInCartIndex]){
                cart.products[productInCartIndex].quantity += 1;
            }else{
                let productToAdd = {};
                productToAdd.id = products[productIndex].id;
                productToAdd.quantity = 1;
                cart.products.push(productToAdd)
            } 
            await this.updateById(cart,cid)
        } catch (error) {
            console.error(`Cannot update cart: ${error}`)
        }
    }
    getProductsInCartById = async(cid)=>{
        let cart = await this.getById(cid);
        let products = await productsService.getAll(__dirname+'/files/products.json');
        let cartDetail = [];
        cart.products.forEach((element) => {
            let prodInCart = {}
            let index = products.findIndex(e=>e.id===element.id)
            prodInCart.name = products[index].name;
            prodInCart.price = products[index].price;
            prodInCart.thumbnail = products[index].thumbnail;
            prodInCart.code = products[index].code;
            prodInCart.description = products[index].description;
            prodInCart.quantity = element.quantity;
            cartDetail.push(prodInCart);
        })
        return cartDetail       
    }
    deleteProductInCartById = async(cid,pid)=>{
        let cart = await this.getById(cid);
        if(cart){        
            let cartIndex = cart.products.findIndex(e=>e.id===pid);
            let productToUpdate = cart.products[cartIndex];
            if(productToUpdate){
                productToUpdate.quantity-=1;
                if(productToUpdate.quantity<1){
                    cart.products.splice(cartIndex,1)
                }
            }else{
                console.log(`There is no PRODUCT with ID ${pid} in CART ${cid}`)   
            }
        }else{
            console.log(`There is no CART ID: ${cid}`)
        }
        let results = await this.updateById(cart,cid)        
    }
}