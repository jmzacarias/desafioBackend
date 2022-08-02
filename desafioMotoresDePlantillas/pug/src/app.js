import express from 'express';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import formRouter from './routes/form.routes.js';

const app = express();
const PORT = 8080;
const server = app.listen(PORT,()=>{
    console.log('Listening on PORT '+PORT )
})

app.set('views',__dirname+'/views')
app.set('view engine', 'pug')

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/',viewsRouter);
app.use('/api/form',formRouter)
