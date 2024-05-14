let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let UtilisateurSchema = Schema({
    id: Number,
    nom: String,
    email: String,
    password: String,
    role: String,//élève ou professeur
});

UtilisateurSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('utilisateurs', UtilisateurSchema);
