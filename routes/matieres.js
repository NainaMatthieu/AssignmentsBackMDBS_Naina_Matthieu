require('dotenv').config();
let Matiere = require('../model/Matiere');
let EtudiantMatiere = require('../model/etudiant_matiere');

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
    matiere.Matiere = req.body.nom;
    matiere.mage = req.body.matiere_img;
    matiere.professeur_id = req.body.professeur_id;
    matiere.prof_img = req.body.prof_img;

    let toAssign = req.body.toAssign

    matiere.save( (err) => {
        if(err){
            res.send('Erreur : ', err);
        }
        res.json({ message: `${matiere} enregistré !`})
        //Attribution de la matière à chaque élève
        for (let etudiantId of toAssign) {
            EtudiantMatiere.create({
                idEtudiant: etudiantId,
                idMatiere: matiere._id
            });
        }
    })
}

// Récupérer toutes les matières
function getMatieres(req, res) {
    Matiere.find( (err, matiere) => {
        if (err) { res.send(err) }
        else res.json(matiere);
    })
}

function getMatieresByProf(req,res){
    Matiere.find({professeur_id:req.params.id}, (err, matiere) => {
        if (err) { res.send(err) }
        else res.json(matiere);
    })
}

module.exports = {getMatiereById, createMatiere, getMatieres, getMatieresByProf};
