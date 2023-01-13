const express = require('express');
const router = express.Router();
const Sauce = require('../models/Sauce');

// Route pour ajouter une sauce
router.post('/', (req, res, next) => {
  const sauce = new Sauce({
    ...req.body,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
    .catch((error) => res.status(400).json({ error }));
});

// Route pour modifier une sauce par son id
router.put('/:id', (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
    .catch((error) => res.status(400).json({ error }));
});

// Route pour supprimer une sauce par son id
router.delete('/:id', (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
    .catch((error) => res.status(400).json({ error }));
});

// Route pour récupérer une sauce par son id
router.get('/:id', (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
});

// Route de la liste des sauces
router.get('/', (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
});

module.exports = router;
