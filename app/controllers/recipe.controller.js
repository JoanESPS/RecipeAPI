const db = require("../models");
const Op = db.Sequelize.Op;
const recipeRepository = db.recipe
const Category = db.categories
const sequelize = db.sequelize



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
        userId: req.userId,
        prepTime: req.body.prepTime,
        comment: req.body.comment
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
                message : err.message || "Le serveur ne répond pas."
            });
        });
};


//Récupérer toutes les recettes avec flags optionnels
exports.getRecipes = (req, res) => {
    let query = req.query.categories;

    if (query != undefined) {
        const rawQuery = `SELECT recipes.id, recipes.name, recipes.userId, recipes.source, recipes.prepTime, recipes.comment
                      FROM recipeapi.recipes AS recipes
                      INNER JOIN recipeapi.recipe_category 
                      ON recipes.id = recipeapi.recipe_category.recipeId
                      WHERE recipeapi.recipe_category.categoryId IN (${query})
                      GROUP BY recipeapi.recipe_category.recipeId
                      HAVING COUNT(distinct recipeapi.recipe_category.categoryId) = ${query.length}`

        sequelize.query(rawQuery)
            .then(([recipes, metadata]) => {
                res.send(recipes);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Le serveur ne répond pas."
                });
            });
    }

    else {
        recipeRepository.findAll({ where: null })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Le serveur ne répond pas."
                });
            });
    }
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
    // Récupération de la recette à modifier
    const recipeToModify = await recipeRepository.findByPk(req.params.id);
    let testBody = true;
    let keyList = [];
    // Organisation du body
    const recipe = {
        name: req.body.name|| recipeToModify.name,
        source: req.body.source || recipeToModify.source,
        prepTime: req.body.prepTime || recipeToModify.prepTime,
        comment: req.body.comment || recipeToModify.comment,
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
                    name: recipe.name,
                    source: recipe.source,
                    prepTime: recipe.prepTime,
                    comment: recipe.comment
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