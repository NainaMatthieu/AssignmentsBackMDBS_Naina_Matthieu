const mongoose = require('mongoose');

let Matiere = mongoose.Schema({
    id: Number,
    Matiere : String,
    image_prof :String,
    image :String
});

module.exports= Matiere