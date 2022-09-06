import mongoose from 'mongoose';

export default class MongoDBContainer{
    constructor(collection,schema){
        mongoose.connect('mongodb://127.0.0.1:27017/verduleria')
        this.model = mongoose.model(collection,schema);
    }

    getAll = async() => {
        try {
            let results = await this.model.find();
            if(results.length>0){
            return results
            }else{return []}
        } catch (error) {
            console.log(`Cannot read collection: ${error}`)
        }
        
    }

    save = async(document) =>{
        try {
            await this.model.create(document);   
        } catch (error) {
            console.log(`Cannot save document: ${error}`)
        }
    }

    getById = async(id)=>{
        try {
            let result = await this.model.findOne({_id:id});
            return result
        } catch (error) {
            console.log(`Cannot get element: ${error}`)
        }
    }

    deleteById = async(id)=>{
        try {
            let result = await this.model.deleteOne({_id:id})
            return result           
        } catch (error) {
            console.log(`Cannot delete element: ${error}`)      
        }
    }

    updateById = async(object,id)=>{
        try {
            let result = await this.model.updateOne({_id:id},{$set:object})
            return result
        } catch (error) {
            console.log(`Cannot update element: ${error}`)           
        }
    }
    deleteAll = async()=>{
        try {
            let results = await this.model.deleteMany({_id})
        } catch (error) {
            console.log(`Cannot delete list: ${error}`)
        }
    }
}
