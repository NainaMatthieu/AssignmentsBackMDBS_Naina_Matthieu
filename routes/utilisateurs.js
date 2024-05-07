require('dotenv').config();
let Utilisateur = require('../model/utilisateur')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');


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

module.exports = { getUtilisateurs,getUtilisateur,loginUser };
