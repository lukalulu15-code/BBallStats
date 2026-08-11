import mongoose from "mongoose";


const statistikaIgracaSchema = new mongoose.Schema({
    id : String,
    utakmicaId:Number,
    klub:String,
    ime:String,
    prezime:String,
    broj:Number,
    minuti:String,
    poeni:Number,
    dvaPoenaPogodak:Number,
    dvaPoenaPromasaj:Number,
    dvaPoenaProcenat:Number,
    triPoenaPogodak:Number,
    triPoenaPromasaj:Number,
    triPoenaProcenat:Number,
    slobodnoPogodak:Number,
    slobodnoPromasaj:Number,
    slobodnoProcenat:Number,
    skokoviNapad:Number,
    skokoviOdbrana:Number,
    skokoviUkupno:Number,
    asistencije:Number,
    ukradene:Number,
    izgubljene:Number,
    blokade:Number,
    blokadePrimljene:Number,
    licneGreske:Number,
    iznudjeniFaulovi:Number,
    indeks:Number,
    plusMinus:Number,
    teren:Boolean,
    starter:Boolean,
},{
    versionKey:false
})
export{statistikaIgracaSchema};
export default mongoose.model('StatistikaIgracaModel',statistikaIgracaSchema,'statistikaIgraca');