const mongoose = require('mongoose');
const Assignment = require('./assignment');

let Matiere = mongoose.Schema({
    id: Number,
    Matiere: String,
    image :String,
    professeur_id : String,
    assignments : [Assignment]
});

module.exports= Matiere