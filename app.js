require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

const password = process.env.DB_PASSWORD;
const userName = process.env.DB_USERNAME;

const app = express();

mongoose.set('strictQuery', false);

// Connexion base de données
mongoose
  .connect(
    `mongodb+srv://${userName}:${password}@cluster0.iywoowj.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
