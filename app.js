const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('Reçu');
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: 'Réponse' });
  next();
});

app.use((req, res) => {
  console.log('Réponse');
});

module.exports = app;
