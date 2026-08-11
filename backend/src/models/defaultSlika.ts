import mongoose from "mongoose";

const Schema= mongoose.Schema;

let DefaultSlika =  new Schema({
    naziv:{
        type:String
    },
    slika:{
        type:String
    }
},{
    versionKey:false
})
export default mongoose.model('DefaultSlikaModel',DefaultSlika,'slike')