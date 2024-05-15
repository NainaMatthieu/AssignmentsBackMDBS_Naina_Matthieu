require('dotenv').config();
let Utilisateur = require('../model/utilisateur');
let EtudiantMatiere = require('../model/etudiant_matiere');
let Matiere = require('../model/Matiere');
let Assignment = require('../model/assignment');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');


function getUtilisateurs(req, res) {
    let aggregateQuery = Utilisateur.aggregate();

    Utilisateur.aggregatePaginate(
        aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        },
        (err, data) => {
            if (err) {
                res.send(err)
            }

            res.send(data);
        }
    );
}

// Récupérer un utilisateur par son id (GET)
function getUtilisateur(req, res) {
    let userId = req.params.id;
    Utilisateur.findById(userId, (err, user) => {
        if (err) { res.send(err) }
        else res.json(user);
    })
}
function loginUser(req, res) {
    Utilisateur.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        var token = jwt.sign({ id: user._id }, process.env._SECRET_KEY, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    });
}
async function getMatiereEtudiant(req, res) {
    try {

        let idEtudiant = req.params.id;
        // console.log(idEtudiant);
        etudiant_matiere = await EtudiantMatiere.find({ idEtudiant })
        console.log(etudiant_matiere)
        const idMatieres = etudiant_matiere.map(relation => relation.idMatiere);
        // console.log(idMatieres);
        Matiere.find({ _id: { $in: idMatieres } }, (err, resultats) => {
            if (err) {
                res.send(err)
            } else {
                res.send(resultats);
            }
        });
    } catch (err) {
        res.send(err)
    }
}
function getAssignmentByIdEtudiant_IdMatiere(req, res) {
    let idEtudiant = req.params.idEtudiant;
    let idMatiere = req.params.idMatiere;

    const aggregatePipeline = [
        {
            $match: {
                idEtudiant: idEtudiant,
                idMatiere: idMatiere
            }
        }
    ];

    let aggregateQuery = Assignment.aggregate(aggregatePipeline);

    Assignment.aggregatePaginate(
        aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        },
        (err, data) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(data);
            }
        }
    );
}

function getAssignmentByIdEtudiant(req, res) {
    let idEtudiant = req.params.idEtudiant;
    const aggregatePipeline = [
        {
            $match: {
                idEtudiant: idEtudiant
            }
        }
    ];
    let aggregateQuery = Assignment.aggregate(aggregatePipeline);
    Assignment.aggregatePaginate(
        aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        },
        (err, data) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(data);
            }
        }
    );
}
module.exports = { getUtilisateurs, getUtilisateur, loginUser, getMatiereEtudiant,getAssignmentByIdEtudiant_IdMatiere,getAssignmentByIdEtudiant };
