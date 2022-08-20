import fs from 'fs';
import __dirname from '../utils.js';
import ProductManager from './productManager.js';

let productService = new ProductManager;

const path = (__dirname+'/files/carts.json');

class CartManager{
    getAll = async()=>{
        try {
            if (fs.existsSync(path)) {
            let fileData = await fs.promises.readFile(path,'utf-8');
            let carts = JSON.parse(fileData);
            return carts   
            } else {
                return []
            }
        } catch (error) {
            console.log(`Cannot read file: ${error}`)
        }
    }
    //CRea un carrito y devuelve su ID
    // El carrito de compras tendrá la siguiente estructura: 
// id, timestamp(carrito), productos: { id, timestamp(producto), products: [Aquí inserte sus productos según lo visto :)]
    create = async()=>{
        try {
            let carts = await this.getAll();
            let cart = {}
            if(carts.length===0){
                cart.id=1;
                cart.timestamp = new Date().toLocaleString()
                cart.products =[];
                carts.push(cart)
                await fs.promises.writeFile(path,JSON.stringify(carts,null,'\t'))
            }else{
                cart.id = carts[carts.length-1].id+1;
                cart.timestamp=new Date().toLocaleString();
                cart.products= [];
                carts.push(cart)
                await fs.promises.writeFile(path,JSON.stringify(carts,null,'\t'))
            }
            return cart
        } catch (error) {
            console.log(`Cannot write file ${error}`)
        }
    }
    deleteCart = async(id)=>{
        try {
            let carts = await this.getAll();
            let index = carts.findIndex(e=> {return e.id ===id});
            if(index>=0){
                carts.splice(index,1);
                await fs.promises.writeFile(path,JSON.stringify(carts,null,'\t'))
            }else{
                console.log(`There is no cart with ID: ${id}`)
            }
        } catch (error) {
            console.log(`Cannot delete element: ${error}`)
        }
    }
    getById = async(id)=>{
        try {
            let carts = await this.getAll();
            let cartFound = carts.filter(cart=>{
                return cart.id === id
            })
            if(cartFound.length>0){
                return cartFound[0]
            }else{
                return null
            }
        } catch (error) {
            console.log(`Cannot get element: ${error}`)
        }
    }
    //  :CID/PRODUCTS
    addProduct = async(product,id)=>{
        try {
            let carts = await this.getAll();
            let cartIndex = carts.findIndex(e=> {return e.id === id});
            let cart = carts[cartIndex];//Obtengo el cart a actualizar
            let products = await productService.getAll(); //Obtengo la lista de productos disponibles
            let productIndex
            if(product.name){      
                productIndex = products.findIndex(e=>e.name==product.name);
                if(productIndex == -1){console.log(`Product is not available`)}                   
            }else{
                productIndex = products.findIndex(e=>e.id===product.id);  
                if(productIndex == -1) {console.log(`Product is not available`)}
            }
            //products[productIndex] ES el producto a agregar dentro del array PRODUCTOS
            let productInCartIndex = cart.products.findIndex(e=>e.id === products[productIndex].id)
            if(cart.products[productInCartIndex]){
                cart.products[productInCartIndex].quantity += 1;
            }else{
                let productToAdd = {};
                productToAdd.id = products[productIndex].id;
                productToAdd.timestamp = new Date().toLocaleString();
                productToAdd.quantity = 1;
                cart.products.push(productToAdd)
            }
            await fs.promises.writeFile(path,JSON.stringify(carts,null,'\t'))
        } catch (error) {
            console.log(`Cannot add element to cart: ${error}`)
        }
    }
    getProductsInCartById = async(id)=>{
        try {
            let cart = await this.getById(id);
            let products = await productService.getAll();
            let cartDetail = [] ;
            if(cart.products.length > 0){
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
            }else{console.log(`CART ${id} is empty`)}
        } catch (error) {
            console.log(`Cannot show cart: ${error}`)
        }
    }
    deleteById = async(cid,pid)=>{
        try {
            let carts = await this.getAll();
            let cartsIndex = carts.findIndex(e=>e.id===cid)
            let cartToUpdate = carts[cartsIndex];
            let cartIndex = cartToUpdate.products.findIndex(e=>e.id===pid);
            let productToUpdate = cartToUpdate.products[cartIndex]
            console.log({productToUpdate:productToUpdate})
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
                await fs.promises.writeFile(path,JSON.stringify(carts,null,'\t'))
                }else{
                    console.log(`There is no PRODUCT with ID ${pid} in CART ${cid}`)
                }                
            }else{
                console.log(`There is no CART ID: ${cid}`)
            }
        } catch (error) {
            `Cannot delete product ${error}`
        }        
    }
}
export default CartManager;