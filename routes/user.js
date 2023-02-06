const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// Route pour créer un utilisateur
router.post('/signup', userCtrl.signup);
// Route pour identifier un utilisateur quand il se connecte
router.post('/login', userCtrl.login);

module.exports = router;
