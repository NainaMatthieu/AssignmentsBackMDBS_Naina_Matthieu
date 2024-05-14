const mongoose = require('mongoose');

let MatiereSchema = mongoose.Schema({
    id: Number,
    Matiere: String,
    image :String,
    professeur_id : String,
    prof_img :String
});

module.exports = mongoose.model('matieres', MatiereSchema);
