import mongoose from "mongoose";


const utakmicaSchema = new mongoose.Schema({
    id:Number,
    domacin : String,
    gost : String,
    datum : String,
    vreme : String,
    takmicenje: String,
    napomena: String,
    poeniDomacin:Number,
    poeniGost:Number,
    status:String,
    trener:String,
    vremeTajmer:Number,
    cetvrtina:Number,
    tajmerRadi:Boolean,
    poslednjiUpdate:{type:Date,default:null},
    sezonaPocetak:Number,
    sezonaKraj:Number
},{
    versionKey:false
})

export default mongoose.model('UtakmicaModel',utakmicaSchema,'utakmice');