import { Router } from "express";
import ProductManager from "../managers/productManager.js";

const router = Router();

const productService = new ProductManager;

const user='admin';

const isAdmin = (req,res,next)=>{
    if(user='admin')
    next()

}

router.get('/',async(req,res)=>{
    let products = await productService.getAll();
    res.send(products)
})

router.get('/:pid',async(req,res)=>{
    let productId = req.params.pid;
    if(isNaN(productId)) return res.status(400).send({error: `PARAM must be a number`});
    let product = await productService.getById(parseInt(productId));
    if(!product){
        return res.status(400).send(`There's no product whith that ID`)
    }else{
        return res.send(product);
    }
})

router.post('/', async(req,res)=>{
    let clientProduct = req.body;
    if(!clientProduct.price){return res.status(400).send({error:`Product price is missing`})}
    if(!clientProduct.stock){return res.status(400).send({error:`Product stock is missing`})}
    if(isNaN(clientProduct.price)) return res.status(400).send({error:'Price must be a number'});
    if(isNaN(clientProduct.stock)) return res.status(400).send({error:'Stock must be a number'});
    if(!clientProduct.name){return res.status(400).send({error:`Product name is missing`})} 
    if(!clientProduct.thumbnail){return res.status(400).send({error:`Product Image url is missing`})}
    if(!clientProduct.description){return res.status(400).send({error:'Product description is missing'})}
    await productService.save(clientProduct);
    res.send({status:'succes', message:'Added product'})
})

router.put('/:pid',async(req,res)=>{
    let productId = parseInt(req.params.pid);
    if(isNaN(productId)) return res.status(400).send({error: `PARAM must be a number`});
    let productToUpdate = await productService.getById(productId);
    if(!productToUpdate) return res.send({status:'error',error:`There is no product with ID ${productId}`});
    let newProduct = req.body;
    if(isNaN(newProduct.price)) return res.status(400).send({error: 'Price must be a number'});
    if(isNaN(newProduct.stock)) return res.status(400).send({error:'Stock must be a number'});
    if(!newProduct.name){return res.status(400).send({error:`Product name is missing`})} 
    if(!newProduct.price){return res.status(400).send({error:`Product price is missing`})}
    if(!newProduct.thumbnail){return res.status(400).send({error:`Product Image url is missing`})}
    if(!newProduct.stock){return res.status(400).send({error:`Product stock is missing`})}
    if(!newProduct.description){return res.status(400).send({error:'Product description is missing'})}
    await productService.updateById(newProduct,productId);
    res.send({status:`Updated product`})
})

router.delete('/:pid',async(req,res)=>{
    let productId = parseInt(req.params.pid);
    if(isNaN(productId)) return res.status(400).send({error: `PARAM must be a number`});
    let product = await productService.getById(parseInt(productId));
    if(!product){
        return res.status(400).send({error: `There's no product whith ID: ${productId}`})
    }else{
        await productService.deleteById(productId)
        res.send({status: `Deleted product`})
    }
})

export default router;

