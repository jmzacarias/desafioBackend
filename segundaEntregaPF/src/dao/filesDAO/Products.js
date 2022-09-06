import __dirname from "../../utils.js";
import FilesContainer from "./FilesContainer.js";

export default class Products extends FilesContainer{
    constructor(){
        super()
        this.path = __dirname+'/files/products.json'
    }
  
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

    addProduct = async(product)=>{
        try {
            let products = await this.getAll(this.path);
            if(products.length===0){
                product.id=1;
            }else{
                product.id = products[products.length-1].id+1;
            }
            product.code= this.createCode(products);
            products.push(product);
            await this.save(products,this.path)  
        } catch (error) {
            console.log(`Cannot add product ${error}`)
        }
    }
}