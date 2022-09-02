import MemoryContainer from "./MemoryContainer.js";
import Products from "./Products.js";
const productsService = new Products();

export default class Carts extends MemoryContainer{
    constructor(){
        super()
    }
    create = ()=>{
        let cart = {}
        if(this.data.length===0){
            cart.id=1;
        }else{
            cart.id = this.data[this.data.length-1].id+1;
        }
        cart.timestamp = new Date ().toLocaleString()
        cart.products=[]
        this.save(cart)
    }
    addProduct = (product,cid)=>{
        let cartIndex = this.data.findIndex(item=> {return item.id===id});
        let cart = this.data[cartIndex];
        let products = productsService.getAll();
        let productIndex
        if(product.name){
            product.index = products.findIndex(e=>e.name==product.name);
            if(productIndex==-1){console.log('Product is not available')}
        }else{
            productIndex = products.findIndex(e=>e.id===product.id); 
        }
    }
}