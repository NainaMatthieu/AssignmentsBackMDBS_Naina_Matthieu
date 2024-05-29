let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignment = require('./routes/assignments');
let utilisateur = require('./routes/utilisateurs');
let matiere = require('./routes/matieres');
const util = require('util');
const cors = require('cors')

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// mongoose.set('debug', true);
let user = "assignmentuser"
let password = "toto"
// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
const uri = util.format('mongodb+srv://%s:%s@cluster0.2ntwxyq.mongodb.net/assignment_db?retryWrites=true&w=majority&appName=Cluster0', user, password);
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB Assignments_bd dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:" + port + "/api/users que cela fonctionne")
  },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use(cors())

// Pour les formulaires
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Obligatoire si déploiement dans le cloud !
let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';
/*
// http://serveur..../assignments
app.route(prefix + '/assignments')
  .post(assignment.postAssignment)
  .put(assignment.updateAssignment)
  .get(assignment.getAssignments);

app.route(prefix + '/assignments/:id')
  .get(assignment.getAssignment)
  .delete(assignment.deleteAssignment);*/

// http://serveur..../user
app.route(prefix + '/users')
  .get(utilisateur.getUtilisateurs);

app.route(prefix + '/users/:id')
  .get(utilisateur.getUtilisateur)

app.route(prefix + '/users/matiere/:id')
  .get(utilisateur.getMatiereEtudiant)

app.route(prefix + '/users/assignments/:idEtudiant/:idMatiere')
  .get(utilisateur.getAssignmentByIdEtudiant_IdMatiere)

app.route(prefix + '/users/assignments/:idEtudiant')
  .get(utilisateur.getAssignmentByIdEtudiant)


app.route(prefix + '/users/login')
  .post(utilisateur.loginUser)

app.route(prefix + '/users/register')
  .post(utilisateur.registerUser)


app.route(prefix + '/matiere/:id')
  .get(matiere.getMatiereById)

app.route(prefix + '/matiere')
  .post(matiere.createMatiere);

app.route(prefix + '/matieres/:id/prof')
  .get(matiere.getMatieresByProf);

app.route(prefix + '/assignments')
  .post(assignment.postAssignment)
//.put(assignment.updateAssignment)
//.get(assignment.getAssignments);

app.route(prefix + '/user/rendre')
  .post(utilisateur.rendreAssignmentByEtudiant)


app.route(prefix + '/assignments/tonote')
  .get(utilisateur.getAssignmentRenduNonNote)

app.route(prefix + '/matieres')
  .get(matiere.getMatieres);

app.route(prefix + '/matieres/:id/etudiants')
  .get(utilisateur.getEtudiantMatiere)

app.route(prefix + '/eleves')
  .get(utilisateur.getListEtudiant);

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


