let Assignment = require('../model/assignment');
const mongoose = require('mongoose');
// Récupérer tous les assignments (GET)
/*
function getAssignments(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}
*/

function getAssignments(req, res){
    let aggregateQuery = Assignment.aggregate();

    Assignment.aggregatePaginate(
        aggregateQuery, 
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        },
        (err, data) => {
            if(err){
                res.send(err)
            }
    
            res.send(data);
        }
    );
}

function noterAssignments(req,res){
    try {
        const assignments = req.body.assignments;
    
        assignments.forEach((idAssignment) => {
            Assignment.findOneAndUpdate(
                { _id: idAssignment },
                { note: req.body.note, remarques: req.body.remarques },
                { new: true },
                (error, assignment) => {
                    if (error) {
                        res.status(500).send(error);
                    } else {
                        if (assignment) {
                            console.log("Assignment mis à jour :", assignment);
                        } else {
                            console.log("Assignment non trouvé.");
                        }
                    }
                }
            );
        });
    
        res.status(200).send("Modifications enregistrées avec succès.");
    } catch (error) {
        res.status(500).send(error.message);
    }
    
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;
    console.log("--------------------")
    console.log(assignmentId);
    Assignment.findById(assignmentId, (err, assignment) =>{
        if(err){res.send(err)}
        else res.json(assignment);
    })

    // Assignment.findOne({id: assignmentId}, (err, assignment) =>{
    //     if(err){res.send(err)}
    //     res.json(assignment);
    // })
}

// Récupérer un assignment par matière
function getAssignmentByMatiere(req, res){
    let matiere = req.params.id;
    console.log("--------------------")
    Assignment.find({idMatiere:matiere}, (err, assignment) =>{
        if(err){res.send(err)}
        else res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
async function postAssignment(req, res){
    /*let assignment = new Assignment();
    assignment.idMatiere = req.body.idMatiere;
    assignment.idEtudiant = req.body.idEtudiant;
    assignment.nom = req.body.nom;
    assignment.instruction = req.body.instruction;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = false; //par défaut
    assignment.note = 0; //par défaut
    assignment.remarques = "";

    assignment.save( (err) => {
        if(err){
            res.send('Erreur : ', err);
        }
        res.json({ message: `${assignment.nom} enregistré !`})
    })*/
    try {
        const etudiants = req.body.etudiants;

        const assignments = [];
        etudiants.forEach((idEtudiant) => {
            const assignment = new Assignment({
                idMatiere: req.body.idMatiere,
                idEtudiant: idEtudiant,
                nom: req.body.nom,
                instruction: req.body.instruction,
                dateDeRendu: req.body.dateDeRendu,
                rendu: false, // Par défaut
                note: 0, // Par défaut
                remarques: ""
            });
            assignments.push(assignment);
        });

        await Assignment.insertMany(assignments);

        res.status(201).json({ message: "Assignments ajoutés avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur s'est produite lors de l'ajout des assignments");
    }
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(mongoose.Types.ObjectId(req.body._id),req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            res.json({message: 'updated',assignment:assignment})
        }
    });
}

// suppression d'un assignment (DELETE)
// l'id est bien le _id de mongoDB
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} deleted`});
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment,getAssignmentByMatiere, noterAssignments };
