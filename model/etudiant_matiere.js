const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let EtudiantMatiereSchema   = mongoose.Schema({
    idEtudiant: String,
    idMatiere: String
});
EtudiantMatiereSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('etudiant_matieres', EtudiantMatiereSchema);
