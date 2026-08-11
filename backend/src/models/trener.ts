import mongoose from "mongoose";


const trenerSchema = new mongoose.Schema({
    korisnickoIme : String,
    lozinka : String,
    ime : String,
    prezime : String,
    mejl: String,
    klub: String,
    telefon:String,
    slika:String,
    resetToken: String,
    resetTokenExpiry: Date
},{
    versionKey:false
})

export default mongoose.model('TrenerModel',trenerSchema,'treneri');