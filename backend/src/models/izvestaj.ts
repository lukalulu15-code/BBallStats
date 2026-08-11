import mongoose from "mongoose";

const izvestajSchema = new mongoose.Schema({
    id: Number,
    igracKorisnickoIme: String,
    trenerKorisnickoIme: String,
    datum: String,
    tekst: String,
    procitan:Boolean
}, {
    versionKey: false
})

export default mongoose.model('IzvestajModel', izvestajSchema, 'izvestaji');