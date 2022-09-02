import MemoryContainer from "./MemoryContainer.js";

export default class Products extends MemoryContainer{
    constructor(){
        super()
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

    addProduct = (product)=>{
        if(this.data.length===0){
            product.id=1;
            product.code=this.createCode(this.data);
            this.save(product)
        }else{
            product.id = this.data[this.data.length-1].id+1;
            product.code=this.createCode(this.data)
        }
    }
}