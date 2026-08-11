import mongoose from "mongoose";


const igracSchema = new mongoose.Schema({
    korisnickoIme : String,
    lozinka : String,
    ime : String,
    prezime : String,
    mail: String,
    klub: String,
    telefon:String,
    slika:String,
    broj:Number,
    datumRodjenja:String,
    trener:String,
    pozicija:String,
    visina:Number,
    resetToken: String ,
    resetTokenExpiry: Date
},{
    versionKey:false
})

export default mongoose.model('IgracModel',igracSchema,'igraci');