import mongoose from "mongoose";
import statistikaIgraca, { statistikaIgracaSchema } from "./statistikaIgraca";




const utakmicaDogadjajiSchema = new mongoose.Schema({
    id:Number,
    utakmicaId:Number,
    domacin : String,
    gost : String,
    vreme : String,
    cetvrtina:Number,
    poeniDomacin:Number,
    poeniGost:Number,
    opis:String,
    klub:String,
    imeIgraca:String,
    prezimeIgraca:String,
    brojIgraca:Number,
    igrac: {type:statistikaIgracaSchema, default:null}
},{
    versionKey:false
})

export default mongoose.model('UtakmicaDogadjajiModel',utakmicaDogadjajiSchema,'utakmicaDogadjaji');