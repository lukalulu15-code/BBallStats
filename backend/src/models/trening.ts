import mongoose from "mongoose";

const treningSchema = new mongoose.Schema({
  id: Number,
  trenerId: String,        // ko je vodio trening
  igracId: String,         // za kog igrača
  klub: String,
  datum: String,
  opis: String,            // npr. "Šut sa distance", opciono
  uToku:Boolean
}, { versionKey: false });

export default mongoose.model('TreningModel', treningSchema, 'treninzi');