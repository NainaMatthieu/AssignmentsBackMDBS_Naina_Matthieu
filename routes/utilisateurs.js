let Utilisateur = require('../model/utilisateur')



function getUtilisateurs(req, res){
    let aggregateQuery = Utilisateur.aggregate();

    Utilisateur.aggregatePaginate(
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

// Récupérer un utilisateur par son id (GET)
function getUtilisateur(req, res){
    let userId = req.params.id;
    Utilisateur.findById(userId, (err, user) =>{
        if(err){res.send(err)}
        else res.json(user);
    })
}



module.exports = { getUtilisateurs,getUtilisateur };
