const db = require("../models");
const Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");
const Recipe = db.recipe


// Création d'une recette
exports.postRecipe = (req, res) => {

    // Vérification des données saisies par le client
    if (!req.body.name || !req.body.source) {
        res.status(400).send({
            message: "Veuillez compléter les informations obligatoires de la recette (nom et source)."
        });
        return;
    }

    Recipe.create({
        name: req.body.name,
        source: req.body.source
    })
        .then(recipe => {
            res.send(recipe);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Le serveur ne répond pas"
            });
        });
};