import { Router } from "express";
import Contenedor from "../contenedores/contenedor.js";
import { uploader } from "../utils.js";

const router = Router();
const objectService = new Contenedor();

router.post('/', uploader.single('img'), async(req,res)=>{
    const {producto,precio} = req.body;
    if(!req.file) res.send(500).send({status:'error', error:'No se pudo cargar la imagen'})
    if(!producto||!precio) return res.status(400).send({status:'error', error:'Campos incompletos'});
    if(isNaN(precio)) return res.status(400).send({error: 'El precio debe ser un valor numérico'});
    let clientProduct = {
        producto,
        precio,
        thumbnail: req.file.filename
    }
    await objectService.save(clientProduct);
    res.send({status: 'succes', message: `producto ${clientProduct.producto} añadido`})
})

export default router;