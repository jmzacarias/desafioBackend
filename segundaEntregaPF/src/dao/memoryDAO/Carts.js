import MemoryContainer from "./MemoryContainer.js";
import Products from "./Products.js";
const productsService = new Products();

export default class Carts extends MemoryContainer{
    constructor(){
        super()
    }
    create = ()=>{
        let cart = {}
        if(this.data.length===0){
            cart.id=1;
        }else{
            cart.id = this.data[this.data.length-1].id+1;
        }
        cart.timestamp = new Date ().toLocaleString()
        cart.products=[]
        this.save(cart)
    }
    addProduct = (product,cid)=>{
        let cartIndex = this.data.findIndex(item=> {return item.id===cid});
        let cart = this.data[cartIndex];
        let products = productsService.getAll();
        let productIndex
        if(product.name){
            productIndex = products.findIndex(e=>e.name==product.name);
            if(productIndex==-1){console.log('Product is not available')}
        }else{
            productIndex = products.findIndex(e=>e.id===product.id); 
            if(productIndex == -1){console.log('Product is not available')}
        }
        let productInCartIndex = cart.products.findIndex(item=>item.id===product[productIndex].id)
        if(cart.products[productInCartIndex]){
            cart.products[productInCartIndex].quantity += 1;
        }else{
            let productToAdd = {};
            productToAdd.id = products[productIndex].id;
            productToAdd.timestamp = new Date().toLocaleString();
            productToAdd.quantity = 1;
            cart.products.push(productToAdd)
        }
    }
    getProductsInCartById = (cid)=>{
        let cart = this.getById(cid);
        let products = productsService.getAll();
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
    deleteProductInCartById = (cid,pid)=>{
        let carts = this.getAll();
        let cartsIndex = carts.findIndex(e=>e.id===cid)
        let cartToUpdate = carts[cartsIndex];
        let cartIndex = cartToUpdate.products.findIndex(e=>e.id===pid);
        let productToUpdate = cartToUpdate.products[cartIndex]
        if(cartToUpdate){
            if(productToUpdate){
                productToUpdate.quantity -= 1;
                if(productToUpdate.quantity<1){
                    cartToUpdate.products.splice(cartIndex,1)
                    console.log(cartToUpdate.products.length)
                    if(cartToUpdate.products.length===0){
                        carts.splice(cartsIndex,1);
                    }
                }
            }else{
                console.log(`There is no PRODUCT with ID ${pid} in CART ${cid}`)
            }                
        }else{
            console.log(`There is no CART ID: ${cid}`)
        }
    }
}