import { Router } from "express";
import CartManager from "../managers/cartsManager.js";


const router = Router();

const cartService = new CartManager;


// POST: '/:cid/products' - Para incorporar productos al carrito por su id de producto
// DELETE: '/:cid/productos/:pid' - Eliminar un producto del carrito por su id de carrito y de producto

router.post('/',async(req,res)=>{
    let carts = await cartService.create();
    res.send({status:`Success`,message:`Cart created`, cart: carts.id})
})

router.delete('/:cid',async(req,res)=>{
    let cartId = parseInt(req.params.cid);
    console.log({cartId: cartId})
    if(isNaN(cartId)) return res.status(400).send({error: `PARAM must be a number`});
    let cart = await cartService.getById(cartId);
    if(!cart){
        return res.status(400).send(`There's no cart whith ID: ${cartId}`)
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
    if(!clientCart.id && !clientCart.name) return res.status(400).send({error: `You must enter ID or NAME`})
    if(clientCart.id) {if(isNaN(clientCart.id)) return res.status(400).send({error:`ID must be a number`})}
    await cartService.addProduct(clientCart,cartId)
    res.send(`Product Added`)
})

router.get('/:cid/products',async(req,res)=>{
    let cartId = parseInt(req.params.cid);
    if(isNaN(cartId)) return res.status(400).send({error: `PARAM must be a number`});
    let cartDetail = await cartService.getProductsInCartById(cartId)
    res.send(cartDetail)
})

router.delete('/:cid/products/:pid',async(req,res)=>{
    let cartId = parseInt(req.params.cid);
    console.log({cartId:cartId})
    let productId = parseInt(req.params.pid);
    console.log({productId:productId})
    if(isNaN(cartId || productId)) return res.status(400).send({error: `PARAMS must be numbers`})
    await cartService.deleteById(cartId,productId)
    res.send(`Product deleted from cart succesfully`)
})


export default router;

