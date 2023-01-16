const express = require('express');
const auth = require('auth');

const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

// Route de la liste des sauces
router.get('/', auth, saucesCtrl.getAllSauces);

// Route pour récupérer une sauce par son id
router.get('/:id', auth, saucesCtrl.getOneSauce);

// Route pour ajouter une sauce
router.post('/', auth, saucesCtrl.createSauce);

// Route pour modifier une sauce par son id
router.put('/:id', auth, saucesCtrl.modifySauce);

// Route pour supprimer une sauce par son id
router.delete('/:id', auth, saucesCtrl.deleteSauce);

module.exports = router;
