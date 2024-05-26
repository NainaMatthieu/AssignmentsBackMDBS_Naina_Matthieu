require('dotenv').config();
let Utilisateur = require('../model/utilisateur');
let EtudiantMatiere = require('../model/etudiant_matiere');
let Matiere = require('../model/Matiere');
let Assignment = require('../model/assignment');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

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
    Utilisateur.findById(userId).select('-password').exec((err, user) => {
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
            expiresIn: 14400 // expire dans 4h
        });
        // Retourner l'utilisateur avec le token
        res.status(200).send({ auth: true, token: token, user: user });
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

async function getMatiereEtudiant(req, res) {
    try {

        let idMatiere = req.params.id;
        // console.log(idEtudiant);
        matiere_etudiants = await EtudiantMatiere.find({ idMatiere })
        console.log(matiere_etudiants)
        const idEtudiants = matiere_etudiants.map(relation => relation.idEtudiant);
        Utilisateur.find({ _id: { $in: idEtudiants } }, (err, resultats) => {
            if (err) {
                res.send(err)
            } else {
                res.send(resultats);
            }
        })
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

async function registerUser(req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    Utilisateur.create({
        nom: req.body.nom,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
    },
        function (err, user) {
            if (err) return res.status(500).send("Un problème a été rencontré lors de la création de l'utilisateur");
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'aroniainasaotra@gmail.com',
                    pass: 'japmuujuepqwqijk'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            const body = `
                        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                            <div style="background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                                <h3 style="color: #333;">Bonjour,</h3>
                                <p style="color: #555;">Félicitations ! Vous venez de créer un compte sur notre site. Nous sommes ravis de vous accueillir sur notre plateforme.</p>
                                <p style="color: #555;">Nous vous souhaitons une excellente journée !</p>
                                <p style="color: #555;">Cordialement,</p>
                                <p style="color: #555;">L'équipe de MyAssignments</p>
                            </div>
                        </div>
                        `;

            const mailOptions = {
                to: req.body.email,
                subject: 'Email de bienvenue',
                html: body,
            };

            const info = transporter.sendMail(mailOptions);

            // Création du token
            var token = jwt.sign({ id: user._id }, process.env._SECRET_KEY, {
                expiresIn: 86400 // Expiration
            });
            res.status(200).send({ auth: true, token: token, user: user });
        });
}
//rendre le(s) devoir(s) d'un étudiant à un prof
async function rendreAssignmentByEtudiant(req, res) {
   const listIdAssignment = req.body.listAssignment
   try {
    const result = await Assignment.updateMany(
      { _id: { $in: listIdAssignment.map(id => mongoose.Types.ObjectId(id))} },
      { $set: { rendu: false } }
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  } 
}

function getAssignmentRenduNonNote(req,res){
    console.log("ta")
    const aggregatePipeline = [
        {
            $match: {
                rendu :true,
                note: 0,
                remarques: null
            }
        }
    ];
    console.log(aggregatePipeline)
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
function getListEtudiant(req, res) {
    console.log('etudiant')
    Utilisateur.find({role : "eleve"}).select('-password').exec((err, user) => {
        if (err) { res.send(err) }
        else res.json(user);
    })
}
module.exports = {  getUtilisateurs, getUtilisateur, loginUser, getMatiereEtudiant,
                    getAssignmentByIdEtudiant_IdMatiere, getAssignmentByIdEtudiant, 
                    registerUser,rendreAssignmentByEtudiant,getAssignmentRenduNonNote,
                    getListEtudiant,getMatiereEtudiant
                };
