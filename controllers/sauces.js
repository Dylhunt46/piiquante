const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //delete sauceObject._id; // A verif
  console.log(req.body);
  const sauce = new Sauce({
    ...sauceObject,
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
/*
exports.likeSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      // Like
      if(req.body.like === 1)
      // Dislike
      if(req.body.like === -1)
    })
    .catch((error) => res.status(400).json({ error }));
};
*/
