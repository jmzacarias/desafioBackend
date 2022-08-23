import { Router } from "express";
import __dirname from "../utils.js";
import Contenedor from "../contenedores/contenedor.js";

const router = Router();
const objectService = new Contenedor();

router.get('/', async(req,res)=>{
    let productos = await objectService.getAll();

    res.render('productos',{productos});
})

export default router;