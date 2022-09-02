export default class MemoryContainer {
    constructor(){
        this.data = []
    }
    getAll =()=> {
        return this.data
    }

    save = (item) => {
        this.data.push(item)
        return item
    }

    getById = (id)=>{
        let result = this.data.find(item=>item.id===id)
        return result
    }

    deleteByID = (id)=>{
        let index = this.data.findIndex(item=> {return item.id===id})
        this.data.splice(index,1);
        return this.data
    }

    updateById = (object, id)=>{
        let index = this.data.findIndex(item=>{return item.id===id})
        this.data[index] = object;
        return this.data
    }

    deleteAll = ()=>{
        this.data = []
    }
}