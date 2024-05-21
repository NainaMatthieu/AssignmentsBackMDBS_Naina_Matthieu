let Assignment = require('../model/assignment');

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
// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
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
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: 'updated'})
        }

      // console.log('updated ', assignment)
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



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
