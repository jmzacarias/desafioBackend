import { Router } from "express";
import Contenedor from "../contenedores/contenedor.js";
const router = Router();

const objectService = new Contenedor;

router.get('/',(req,res)=>{
    res.render('form');
})

router.get('/productos',async(req,res)=>{
    let productos = await objectService.getAll();

    res.render('productos',{productos});
})


export default router;