const db = require("../models");
const Op = db.Sequelize.Op;
const recipeRepository = db.recipe
const Category = db.categories


// Création d'une recette
exports.postRecipe =(req, res) => {

    // Vérification des données saisies par le client
    if (!req.body.name || !req.body.source) {
        res.status(400).send({
            message: "Veuillez compléter les informations obligatoires de la recette (nom et source)."
        });
        return;
    }

    recipeRepository.create({
        name: req.body.name,
        source: req.body.source,
        userId: req.userId
    })
        .then(recipe => {
            if (req.body.categories) {
                Category.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.categories
                        }
                    }
                }).then(categories => {
                    recipe.setCategories(categories).then(() => {
                        res.status(201).send({
                            message: `La recette a bien été créée avec les catégories sélectionnées.` });
                    });
                });
            } else {
                // recette créée sans catégories.
                    res.status(201).send({
                        message: `La recette a bien été créée (sans catégories).`});
            }
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Le serveur ne répond pas"
            });
        });
};


//Récupérer toutes les recettes avec flags optionnels
exports.getRecipes = (req, res) => {

    recipeRepository.findAll({where: req.query})
        .then(recipe => {
            res.send(recipe);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Le serveur ne répond pas."
            });
        });
};


// Récupérer une recette
exports.getOneRecipe = (req, res) => {
    const id = req.params.id;

    recipeRepository.findByPk(id)
        .then(recipe => {
            if (recipe) {
                res.send(recipe);
            } else {
                res.status(404).send({
                    message: `La recette avec l'id ${id} n'existe pas.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Le serveur ne répond pas"
            });
        });
};

// Changement des informations d'une recette
exports.patchRecipe = async (req, res) => {
    // Récupération du user à modifier
    const recipeToModify = await recipeRepository.findByPk(req.params.id);
    let testBody = true;
    let keyList = [];
    // Organisation du body
    const recipe = {
        newName: req.body.newName || recipeToModify.name,
        newUserId: req.body.newUserId || recipeToModify.userId,
        newSource: req.body.newSource || recipeToModify.source,
        newTarget: req.body.newTarget || recipeToModify.target,
        newVegetarian: req.body.newVegetarian || recipeToModify.vegetarian,
        newVegan: req.body.newVegan || recipeToModify.vegan,
        newCountry: req.body.newCountry || recipeToModify.country,
        newHot: req.body.newHot || recipeToModify.hot,
        newCold: req.body.newCold || recipeToModify.cold,
        newSeason: req.body.newSeason || recipeToModify.season,
        newCookTime: req.body.newCookTime || recipeToModify.cookTime,
        newPrepTime: req.body.newPrepTime || recipeToModify.prepTime,
        newTotalTime: req.body.newTotalTime || recipeToModify.totalTime,
        newDifficulty: req.body.newDifficulty || recipeToModify.difficulty,
        newSrcRating: req.body.newSrcRating || recipeToModify.srcRating,
        newUserRating: req.body.newUserRating || recipeToModify.userRating,
        newTried: req.body.newTried || recipeToModify.tried,
        newComment: req.body.newComment || recipeToModify.comment,
    }

    // On s'assure que les informations mentionnées dans le body sont correctes
    for (let key in req.body) {
        if (!(key in recipe)) {
            keyList.push(key)
            testBody = false
        }
    }

    if (!testBody) {
        res.status(400).send({
            message: `Les clés suivantes: [${keyList}], ne font pas partie des clés autorisées, se référer à la documentation pour voir les clés valides.`
        })
    }

    // On effectue la modification uniquement si toutes les clés sont correctes
    else {
        // Vérification qu'un user modifie ses propres recettes
        if (req.userId == recipeToModify.userId) {

            // Utilisation de .update avec un body déclaré à la main
            await recipeRepository.update({
                    name: recipe.newName,
                    userId: recipe.newUserId,
                    source: recipe.newSource,
                    target: recipe.newTarget,
                    vegetarian: recipe.newVegetarian,
                    vegan: recipe.newVegan,
                    country: recipe.newCountry,
                    hot: recipe.newHot,
                    cold: recipe.newCold,
                    season: recipe.newSeason,
                    cookTime: recipe.newCookTime,
                    prepTime: recipe.newPrepTime,
                    totalTime: recipe.newTotalTime,
                    difficulty: recipe.newDifficulty,
                    srcRating: recipe.newSrcRating,
                    userRating: recipe.newUserRating,
                    tried: recipe.newTried,
                    comment: recipe.newComment,
                },
                {
                    where : {id: req.params.id}
                }).catch(err => {
                res.status(500).send({
                    message: "Erreur dans le changement d'informations de la recette pour l'id=" + req.params.id
                })});
            res.status(200).send({
                message: `Les informations de ${recipeToModify.name} ont été changées.`
            });
        }

        // Message d'erreur lorsqu'un user souhaite modifier les informations de la recette d'un autre user
        else {
            res.status(403).send({
                message: "Vous n'avez pas les droits nécessaires à cette action."
            })
        }
    }
};

exports.deleteOneRecipe = async (req, res) => {
    const id = req.params.id;

    // Récupération de la recette à supprimer
    const recipeToDelete = await recipeRepository.findByPk(req.params.id);
    const recipeName = await recipeToDelete.name;

    // Vérification des autorisations
    if (req.userId == recipeToDelete.userId || req.userRoles.includes('admin') || req.userRoles.includes('moderator')) {

        // Suppression d'une recette
        recipeRepository.destroy({
            where: {id: id}
        })
            .then(num => {
                if (num == 1) {
                    res.status(200).send({
                        message: `La recette ${recipeName} (id: ${id}) a été supprimé.`
                    });
                } else {
                    res.status(400).send({
                        message: `${recipeName} (id: ${id}) n'a pas pu être supprimé.`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Le serveur ne répond pas."
                });
            });
    }

    else {
        res.status(403).send({
            message: "Utilisateur non autorisé."
        });
    }
};

exports.deleteAllRecipes = async (req, res) => {

    // Suppression de toutes les recettes par un modérateur
    recipeRepository.destroy({
        where: {}
    })
        .then(nums => {
            res.status(200).send({
                message: `Toutes les recettes ont été supprimées.`
            })
        })
        .catch(err => {
            res.status(500).send({
                message: "Le serveur ne répond pas"
            });
        });
}