const Sauce = require('../models/Sauce');
const fs = require('fs');

/**
 * Permet de créer une sauce
 * Par un utilisateur authentifié par token
 * Enregistre la sauce dans la BDD
 */
exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject.userId;

  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: 'Sauce enregistrée' });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

/**
 * Permet de modifier une sauce
 * Par un utilisateur authentifié par token
 * Modifie la sauce dans la BDD
 */
exports.modifySauce = (req, res) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._id;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non-autorisé' });
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

/*exports.modifySauce = (req, res) => {
  if (req.file) {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      //recup du deuxième element du tableau constitué du avant/après '/images/'
      let filename = sauce.imageUrl.split('/images/')[1];
      // supprime le après '/images/' et début du callback
      fs.unlink(`images/${filename}`, () => console.log('Image supprimée !'));
    });
  }
  // on verifie si l'objet existe
  let sauceObject = req.file
    ? {
        //recup du corps de le requete
        ...JSON.parse(req.body.sauce),

        // traitement de la nouvelle image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : // sinon on modifie juste le corps de la requête
      { ...req.body };
  // modif de la sauce dans la base de donnée
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    // rep 200 + message
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    //erreur 400
    .catch((error) => res.status(400).json({ error }));
};*/

/**
 * Permet de supprimer une sauce
 * Par l'utilisateur qui l'a créée
 * Supprime la sauce dans la BDD
 */
exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non-autorisé' });
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// Permet d'afficher une sauce par son Id
exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// Permet d'afficher la liste des sauces
exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//Permet la gestion des like/dislikes
exports.likeSauce = (req, res) => {
  // Récuperer la sauce
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Like si l'utilisateur n'a pas déjà liké/disliké la sauce
      if (
        !sauce.usersLiked.includes(req.body.userId) &&
        !sauce.usersDisliked.includes(req.body.userId) &&
        req.body.like === 1
      ) {
        // Ajout 1 like + id utilisateur dans usersLiked
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
        )
          .then(() => res.status(201).json({ message: 'Like enregistré' }))
          .catch((error) => res.status(400).json({ error }));

        // Dislike si l'utilisateur n'a pas déjà liké/disliké la sauce
      } else if (
        !sauce.usersLiked.includes(req.body.userId) &&
        !sauce.usersDisliked.includes(req.body.userId) &&
        req.body.like === -1
      ) {
        // Ajout 1 dislike + id utilisateur dans usersDisliked
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
        )
          .then(() => res.status(201).json({ message: 'Dislike enregistré' }))
          .catch((error) => res.status(400).json({ error }));
        // Si l'utilisateur retire son like
      } else if (
        sauce.usersLiked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        // Enlève 1 like + Retire id utilisateur dans usersLiked
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
        )
          .then(() => res.status(200).json({ message: 'Like annulé' }))
          .catch((error) => res.status(400).json({ error }));
        // Si l'utilisateur retire son dislike
      } else if (
        sauce.usersDisliked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        // Enlève 1 dislike + Retire id utilisateur dans usersDisliked
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
        )
          .then(() => res.status(200).json({ message: 'Dislike annulé' }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(404).json({ message: 'Non authorisé' }));
};
