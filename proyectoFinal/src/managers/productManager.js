import fs from 'fs';
import __dirname from '../utils.js';

const path = (__dirname+'/files/products.json');


class ProductManager{
    createCode = (products)=>{
        let productFiltered;
        let createdCode ='';
        do{
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        for(let i=0; i<25; i++){
            createdCode += characters.charAt(Math.floor(Math.random()*characters.length))
        }
        productFiltered = products.filter(product=>{
            return product.code === createdCode
        })
        }while(productFiltered===1)
        return createdCode
    };

    getAll = async()=>{
        try {
            if(fs.existsSync(path)){
            let fileData = await fs.promises.readFile(path,'utf-8');
            let products = JSON.parse(fileData);
            return products
            }else{
                return [];
            }
        } catch (error) {
            console.log(`Cannot read file: ${error}`)
        }   
    }
    save = async(product)=>{
        try {
             let products = await this.getAll();
            if(products.length===0){
                product.id=1;
                product.code= this.createCode(products);
                products.push(product);
                await fs.promises.writeFile(path,JSON.stringify(products,null,'\t'))  
            }else{
                product.id = products[products.length-1].id+1;
                product.code= this.createCode(products);
                products.push(product);
                await fs.promises.writeFile(path,JSON.stringify(products,null,'\t'))
            }
        } catch (error) {
            console.log(`Cannot write file ${error}`)
        }
    }
    getById = async(id)=>{
        try {
            let products = await this.getAll();
            let productFound = products.filter(product=>{
                return product.id === id
            })
            if(productFound.length>0){
                return productFound[0]
            }else{
                return null
            }
        } catch (error) {
            console.log(`Cannot get element: ${error}`)
        }
    }
    deleteById = async(id)=>{
        try {
            let products = await this.getAll();
            let index = products.findIndex(e=> {return e.id === id});
            console.log(index)
            if( index >=0){
                products.splice(index,1);
                await fs.promises.writeFile(path,JSON.stringify(products,null,'\t'))
            }else{
                console.log(`There is no item with ID: ${id}`)
            }
        } catch (error) {
            console.log(`Cannot delete element: ${error}`)
        }
    }
    updateById = async(product,id)=>{
        try {
            let products = await this.getAll();
            let index = products.findIndex(e=> {return e.id === id});
            product.id = products[index].id;
            product.code = this.createCode(products);
            products[index]=product;
            await fs.promises.writeFile(path,JSON.stringify(products,null,'\t'));
        } catch (error) {
            console.log(`Cannot update element: ${error}`)
        }
    }
}

export default ProductManager;