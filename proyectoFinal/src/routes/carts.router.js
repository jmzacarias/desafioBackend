import { Router } from "express";
import CartManager from "../managers/cartsManager.js";
import ProductManager from "../managers/productManager.js";


const router = Router();

const cartService = new CartManager; 
const productService = new ProductManager;

// POST: '/:cid/products' - Para incorporar productos al carrito por su id de producto
// DELETE: '/:cid/productos/:pid' - Eliminar un producto del carrito por su id de carrito y de producto

router.post('/',async(req,res)=>{
    let carts = await cartService.create();
    res.send({status:`Success`,message:`Cart created`, cartID: carts.id})
})

router.delete('/:cid',async(req,res)=>{
    let cartId = parseInt(req.params.cid);
    console.log({cartId: cartId})
    if(isNaN(cartId)) return res.status(400).send({error: `PARAM must be a number`});
    let cart = await cartService.getById(cartId);
    if(!cart){
        return res.status(400).send({error: `There's no cart whith ID: ${cartId}`})
    }else{
        await cartService.deleteCart(cartId)
        res.send({status:`Deleted cart`})
    }
})

router.post('/:cid/products',async(req,res)=>{
    let cartId = parseInt(req.params.cid); 
    if(isNaN(cartId)) return res.status(400).send({error: `PARAM must be a number`});
    let carts = await cartService.getAll();
    let cart = carts.find(e=> {return e.id===cartId});
    if(!cart) return res.status(400).send({error: `There is no cart with ID: ${cartId}`})
    //filtrar
    let clientCart = req.body;  
    let products = await productService.getAll()
    if(!clientCart.id && !clientCart.name) return res.status(400).send({error: `You must enter ID or NAME`})
    if(clientCart.id) {if(isNaN(clientCart.id)) return res.status(400).send({error:`ID must be a number`})}
    if(clientCart.id) {
        let product = products.find(e=>e.id===clientCart.id)
        if(!product) return res.status(400).send({error: `There is no product with ID ${clientCart.id} available`})
    }
    if(clientCart.name) {
        let product = products.find(e=>e.name===clientCart.name)
        let nameLowerCase = clientCart.name.toLowerCase()
        clientCart.name = nameLowerCase.charAt(0).toUpperCase() + nameLowerCase.slice(1)
        if(!product) return res.status(400).send({error: `${clientCart.name} is not available`})
    }
    await cartService.addProduct(clientCart,cartId)
    res.send({status: `1 product added`})
})

router.get('/:cid/products',async(req,res)=>{
    let cartId = parseInt(req.params.cid);
    if(isNaN(cartId)) return res.status(400).send({error: `PARAM must be a number`});
    let cart = await cartService.getById(cartId)
    if(!cart) return res.status(400).send({error: `There is no CART ${cartId}`})
    if(cart.products.length===0) return res.status(400).send({error:`Cart ${cartId} is empty`})
    let cartDetail = await cartService.getProductsInCartById(cartId)
    res.send(cartDetail)
})

router.delete('/:cid/products/:pid',async(req,res)=>{
    let cartId = parseInt(req.params.cid);
    let productId = parseInt(req.params.pid);
    if(isNaN(cartId || productId)) return res.status(400).send({error: `PARAMS must be numbers`})
    let cart = await cartService.getById(cartId)
    if(!cart) return res.status(400).send({error: `There is no CART ${cartId}`})
    if(cart.products.legth===0) return res.status(400).send({error: `Cannot delete product; CART ${cartId} is empty`})
    let isProductInCart = cart.products.find(e=>e.id===productId);
    if(!isProductInCart) return res.status(400).send({error:`There is no PRODUCT with ID ${productId} in CART ${cartId}`})
    await cartService.deleteById(cartId,productId)
    res.send({status: `Product deleted from cart succesfully`})
})


export default router;

