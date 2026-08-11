import mongoose from "mongoose";


const protivnickiIgracSchema = new mongoose.Schema({
    id : Number,
    ime : String,
    prezime : String,
    klub: String,
    broj:Number,
    pozicija:String,
    utakmicaId:Number
},{
    versionKey:false
})

export default mongoose.model('ProtivnickiIgracModel',protivnickiIgracSchema,'protivnickiIgraci');