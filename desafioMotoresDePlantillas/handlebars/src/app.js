import express from 'express';
import Contenedor from './contenedores/contenedor.js'
import __dirname from './utils.js';
import fs from 'fs';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import formRouter from './routes/form.routes.js';

const path = (__dirname+'/files/objetos.json')

const objectService = new Contenedor;
const app = express();
const PORT = 8080;
const server = app.listen(PORT,()=>{
    console.log('Listening on PORT '+PORT )
})

app.engine('handlebars', handlebars.engine());
app.set('views',__dirname+'/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/',viewsRouter);
app.use('/api/form',formRouter)
