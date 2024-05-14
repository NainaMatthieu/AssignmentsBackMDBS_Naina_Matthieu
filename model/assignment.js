let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let AssignmentSchema= Schema({
    id: Number,
    idMatiere : String,
    idEtudiant : String,
    dateDeRendu: Date,
    nom: String,
    instruction : String,
    rendu: Boolean,
    note: {
        type: Number,
        min: 0,
        max: 20,
        default : 0
    },
    remarques : String
});

AssignmentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('assignments', AssignmentSchema);