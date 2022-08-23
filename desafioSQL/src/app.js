import express from "express";
import {Server} from 'socket.io';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/view.router.js';
import productosRouter from './routes/productos.router.js';
import Contenedor from "./contenedores/contenedor.js";
import db from "./db/sqlite3.js";


const objectService = new Contenedor;

const app = express();

const server = app.listen(8080, ()=>console.log('listening on 8080'));

app.engine('handlebars', handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const io = new Server(server);

app.use(express.static(__dirname+'/public'));
app.use('/',viewsRouter);
app.use('/api/productos',productosRouter);

 
io.on('connection', socket=>{
    console.log('socket connected');
    
    socket.on('message', async(data)=>{
        await db('chat').insert(data);
        let chatHistory = await db('chat').select('*');
        io.emit('log', chatHistory)
    });
    socket.on('newProduct', async()=>{
        let listado = await objectService.getAll();
        io.emit('agregarProducto', data)
        
    })
})
