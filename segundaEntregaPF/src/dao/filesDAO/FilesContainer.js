import fs from 'fs';
import __dirname from '../../../src/utils.js';

export default class FilesContainer {
    constructor(){
        
    }
    getAll = async(path)=>{
        try {
            if(fs.existsSync(path)){
            let fileData = await fs.promises.readFile(path,'utf-8');
            let data = JSON.parse(fileData);
            return data
            }else{
                return [];
            }
        } catch (error) {
            console.log(`Cannot read file: ${error}`)
        }
    }
    save = async(items,path)=>{
        try {
            await fs.promises.writeFile(path,JSON.stringify(items,null,'\t'))
       } catch (error) {
           console.log(`Cannot write file ${error}`)
       }
    }
    getById = async(id,path)=>{
        try {
            let items = await this.getAll(path)
            let result = items.filter(item=>{return item.id===id})
            return result[0]
        } catch (error) {
            console.log(`Cannot get element: ${error}`)
        }
    }
    deleteByID = async(id,path)=>{
        try {
            let items = await this.getAll(path)
            let index = items.findIndex(item=>{return item.id===id})
            items.splice(index,1);
            await this.save(items,path)
        } catch (error) {
            console.log(`Cannot delete element: ${error}`)
        }
    }
    updateById = async(object,id,path)=>{
        try {
            let items = await this.getAll(path);
            let index = items.findIndex(item=>{return item.id === id});
            items[index] = object;
            await this.save(items,path)
        } catch (error) {
            console.log(`Cannot update element: ${error}`)
        }
    }

    deleteAll = async(path)=>{
        try {
            await this.save([],path)
        } catch (error) {
            console.log(`Cannot delete list: ${error}`)
        }
    }
}