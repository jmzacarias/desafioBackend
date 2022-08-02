import fs from 'fs';
import __dirname from '../utils.js';
const path = (__dirname+'/files/objetos.json')

class Contenedor {
   getAll = async()=>{
        try {
            if(fs.existsSync(path)){
                let fileData = await fs.promises.readFile(path, 'utf8');
                let objects = JSON.parse(fileData);
                return objects; 
            }else{
                return [];
            }
        } catch (error) {
            console.log('No se puede leer el archivo: '+error)
        }
   }
   save = async(object)=>{
        try {
            let objects = await this.getAll();
            if(objects.length===0){
                object.id=1;
                objects.push(object);
                await fs.promises.writeFile(path,JSON.stringify(objects,null,'\t'))
            }else{
                object.id = objects[objects.length-1].id+1;
                objects.push(object);
                await fs.promises.writeFile(path,JSON.stringify(objects,null,'\t'))
            }
        } catch (error) {
            console.log('Cannot write file: '+error)
        }
   }
   getById = async(id)=>{
        try {
            let objects = await this.getAll();
            let objectFound = objects.filter(object=>{
                return object.id === id
            })
            if(objectFound.length>0){
                return objectFound[0]
            }else{
                return null
            }
        } catch (error) {
            console.log('Cannot get element: '+error)
        }
   }
   deleteById = async(id)=>{
    try {
        let objects = await this.getAll();
        let objectFound = objects.filter(object=>{
            return object.id === id
        })
        if(objectFound.length>0){
            const index = objects.indexOf(objectFound[0])
            console.log('indexOf tira'+index);
            objects.splice(index,1)
            await fs.promises.writeFile(path,JSON.stringify(objects,null,'\t'))
        }else{
            console.log('No existe elemento con ID: '+id)
        }
    } catch (error) {
        console.log('Cannot delete element: '+error)
    }
   }
   deleteAll = async()=>{
        try {
            let objects = [];
            await fs.promises.writeFile(path,JSON.stringify(objects,null,'\t'))
        } catch (error) {
            console.log('Cannot delete element: '+error)
        }
   }
}

export default Contenedor;