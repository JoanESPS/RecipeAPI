const db = require("../models");
const userRepository = db.user;
const recipeRepository = db.recipe;
const categoryRepository = db.categories;

// Vérification existence d'un id utilisateur
isUserIdExisting = (req, res, next) => {
    const id = req.params.id;
    userRepository.findOne({
        where: {id: id}
    })
        .then(
            user => {
                if (!user) {
                    return res.status(404).send({
                        message: "Utilisateur non trouvé."
                    })
                }
                next();
            })
        .catch(err => {
            res.status(500).send({
                message: "Le serveur ne répond pas."
            });
        });
}

// Vérification existence id recette
isRecipeIdExisting = (req, res, next) => {
    const id = req.params.id;
    recipeRepository.findOne({
        where: {id: id}
    })
        .then(
            recipe => {
                if (!recipe) {
                    return res.status(404).send({
                        message: "Recette non trouvée."
                    })
                }
                next();
            })
        .catch(err => {
            res.status(500).send({
                message: "Le serveur ne répond pas."
            });
        });
}

// Vérification existence id catégorie
isCategoryIdExisting = (req, res, next) => {
    const id = req.params.id;
    categoryRepository.findOne({
        where: {id: id}
    })
        .then(
            category => {
                if (!category) {
                    return res.status(404).send({
                        message: "Catégorie non trouvée."
                    })
                }
                next();
            })
        .catch(err => {
            res.status(500).send({
                message: "Le serveur ne répond pas."
            });
        });
}

const errors = {
    isUserIdExisting: isUserIdExisting,
    isRecipeIdExisting: isRecipeIdExisting,
    isCategoryIdExisting: isCategoryIdExisting
};

module.exports = errors;