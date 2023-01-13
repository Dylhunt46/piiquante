const express = require('express');
const router = express.Router();
const saucesCtrl = require('../controllers/sauces');

// Route pour ajouter une sauce
router.post('/', saucesCtrl.createSauce);

// Route pour modifier une sauce par son id
router.put('/:id', saucesCtrl.modifySauce);

// Route pour supprimer une sauce par son id
router.delete('/:id', saucesCtrl.deleteSauce);

// Route pour récupérer une sauce par son id
router.get('/:id', saucesCtrl.getOneSauce);

// Route de la liste des sauces
router.get('/', saucesCtrl.getAllSauces);

module.exports = router;
