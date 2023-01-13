const express = require('express');

const app = express();
const mongoose = require('mongoose');
const Sauce = require('./models/Sauce');

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
  const sauce = new Sauce({
    ...req.body,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
    .catch((error) => res.status(400).json({ error }));
});

// Route pour modifier une sauce par son id
app.put('/api/sauces/:id', (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
    .catch((error) => res.status(400).json({ error }));
});

// Route pour supprimer une sauce par son id
app.delete('/api/sauces/:id', (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
    .catch((error) => res.status(400).json({ error }));
});

// Route pour récupérer une sauce par son id
app.get('/api/sauces/:id', (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
});

// Route de la liste des sauces
app.get('/api/sauces', (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
});

module.exports = app;
