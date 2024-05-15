require('dotenv').config();
let Matiere = require('../model/Matiere');


function getMatiereById(req, res) {
    let matiereId = req.params.id;
    Matiere.findById(matiereId, (err, matiere) => {
        if (err) { res.send(err) }
        else res.json(matiere);
    })
}

module.exports = {getMatiereById};
