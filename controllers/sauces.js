const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject.userId;
  console.log(req.body);
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

/*
exports.createSauce = (req, res) => {
  const sauceObject =
    typeof req.body === 'string' ? JSON.parse(req.body.sauce) : req.body;

  console.log(req.body);
  const sauce = new Sauce({
    userId: req.auth.userId,
    name: sauceObject.name,
    manufacturer: sauceObject.manufacturer,
    description: sauceObject.description,
    mainPepper: sauceObject.mainPepper,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    heat: sauceObject.heat,
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
*/

exports.modifySauce = (req, res, next) => {
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
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
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

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
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
