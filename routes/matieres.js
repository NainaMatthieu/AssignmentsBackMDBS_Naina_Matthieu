require('dotenv').config();
let Matiere = require('../model/Matiere');


function getMatiereById(req, res) {
    let matiereId = req.params.id;
    Matiere.findById(matiereId, (err, matiere) => {
        if (err) { res.send(err) }
        else res.json(matiere);
    })
}

// Ajout d'une matière (POST)
function createMatiere(req, res){
    let matiere = new Matiere();
    matiere.Matiere = req.body.Matiere;
    matiere.image = req.body.image;
    matiere.professeur_id = req.body.professeur_id;
    matiere.prof_img = req.body.prof_img;

    matiere.save( (err) => {
        if(err){
            res.send('Erreur : ', err);
        }
        res.json({ message: `${matiere.Matiere} enregistré !`})
    })
}

// Récupérer toutes les matières
function getMatieres(req, res) {
    Matiere.find( (err, matiere) => {
        if (err) { res.send(err) }
        else res.json(matiere);
    })
}

module.exports = {getMatiereById, createMatiere, getMatieres};
