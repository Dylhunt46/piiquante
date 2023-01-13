const express = require('express');

const app = express();
const mongoose = require('mongoose');

mongoose
  .connect(
    'mongodb+srv://Dylhunt:MonMdpCluster2912+@cluster0.iywoowj.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Accès au corp de la requête
app.use(express.json());

//Ajout des headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

// Route pour ajouter une sauce
app.post('/api/sauces', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({ message: 'Objet' });
});

// Route de la liste des sauces
app.get('/api/sauces', (req, res, next) => {
  const sauces = [
    {
      // _id: '',
      userId: '',
      name: '',
      manufacturer: '',
      description: '',
      mainPepper: '',
      imageUrl: '',
      heat: '', // Number
      likes: '', // Number
      dislikes: '', // Number
      usersLiked: '', // + <userId>
      usersDisliked: '', // + <userId>
    },
  ];
  res.status(200).json(sauces);
});

module.exports = app;
