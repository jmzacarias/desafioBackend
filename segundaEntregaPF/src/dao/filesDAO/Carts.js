import __dirname from "../../utils.js";
import FilesContainer from "./FilesContainer.js";
import Products from "./Products.js";

const productsService = new Products();

export default class Carts extends FilesContainer{
    constructor(){
        super();
        this.path = __dirname+'/files/carts.json'
    }
    create = async()=>{
        let carts = await this.getAll(this.path);
        let cart = {}
        if(carts.length===0){
            cart.id=1;
        }else{
            cart.id = carts[carts.length-1].id+1;
        }
        cart.timestamp = new Date ().toLocaleString()
        cart.products=[]
        carts.push(cart)
        this.save(carts,this.path)
    }
    addProduct = async(product,cid)=>{
        try {
            let carts = await this.getAll(this.path);
            let cartIndex = carts.findIndex(item=> {return item.id===cid});
            let cart = carts[cartIndex];
            let products = await productsService.getAll(__dirname+'/files/products.json');
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
            await this.save(carts,this.path)
        } catch (error) {
            console.error(`Cannot update cart: ${error}`)
        }
    }
    getProductsInCartById = async(cid)=>{
        let cart = await this.getById(cid,this.path);
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
        let carts = await this.getAll(this.path);
        let cartsIndex = carts.findIndex(e=>e.id===cid);
        let cartToUpdate = carts[cartsIndex];
        let cartIndex = cartToUpdate.products.findIndex(e=>e.id===pid);
        let productToUpdate = cartToUpdate.products(cartIndex);
        if(cartToUpdate){
            if(productToUpdate){
                productToUpdate.quantity-=1;
                if(productToUpdate.quantity<1){
                    cartToUpdate.products.splice(cartIndex,1)
                    if(cartToUpdate.products.length===0){
                        carts.plice(cartsIndex,1);
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