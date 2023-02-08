const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const password = require('../middleware/password');

// Route pour créer un utilisateur
router.post('/signup', password, userCtrl.signup);
// Route pour identifier un utilisateur quand il se connecte
router.post('/login', userCtrl.login);

module.exports = router;
