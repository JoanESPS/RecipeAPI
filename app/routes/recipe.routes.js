/**
 * @swagger
 * components:
 *   schemas:
 *     RecipePost:
 *       type: object
 *       required:
 *         - name
 *         - source
 *       properties:
 *         userId:
 *           type: integer
 *           description: Id généré par Sequelize
 *         name:
 *           type: string
 *           description: Le nom de la recette
 *         source:
 *           type: string
 *           description: Source de la recette
 *         prepTime:
 *           type: integer
 *           description: Temps de préparation totale de la recette
 *         comment:
 *           type: string
 *           description: Commentaires
 *       example:
 *         name: Tartiflette
 *         source: Livre de cuisine - page 12
 *         prepTime: 45
 *         comment: C'est super bon !
 *         categories: [french, hot]
 *
 *     RecipeGet:
 *       type: object
 *       example:
 *         id: 1
 *         name: Tartiflette
 *         userId: 1
 *         source: Livre de cuisine - page 12
 *         prepTime: 45
 *         comment: C'est super bon !
 *         createdAt: 2023-02-01T14:35:33.000Z
 *         updatedAt: 2023-02-01T14:35:33.000Z
 *
 *     RecipePatch:
 *       type: object
 *       required:
 *         - name
 *         - source
 *       properties:
 *         name:
 *           type: string
 *           description: Le nom de la recette
 *         source:
 *           type: string
 *           description: Source de la recette
 *         prepTime:
 *           type: integer
 *           description: Temps de préparation totale de la recette
 *         comment:
 *           type: string
 *           description: Commentaires
 *       example:
 *         name: Crousiflette
 *         source: Livre de cuisine - page 13
 *         prepTime: 55
 *         comment: C'est encore meilleur que la tartiflette !
 */

/**
 * @swagger
 * tags:
 *   name: Recettes
 *   description: Gestionnaire de recettes
 * /api/recipes:
 *   post:
 *     summary: Création d'une nouvelle recette
 *     tags: [Recettes]
 *     responses:
 *       201:
 *         description: La recette a bien été créée avec les catégories sélectionnées..
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecipePost'
 *       500:
 *         description: Le serveur ne répond pas.
 *
 *   get:
 *     summary: Récupération de la liste des recettes
 *     tags: [Recettes]
 *     responses:
 *       200:
 *         description: Liste de toutes les recettes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipeGet'
 *       500:
 *         description: Le serveur ne répond pas.
 *
 * /api/recipes/{id}:
 *
 *   get:
 *     summary: Récupération d'une recette par son id
 *     tags: [Recettes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id de la recette
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecipeGet'
 *       404:
 *         description: La recette n'existe pas.
 *
 *   patch:
 *    summary: Mise à jour des informations en fonction de l'id
 *    tags: [Recettes]
 *    parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id de la recette
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipePost'
 *    responses:
 *      200:
 *        description: Les informations de la recette ont été changées.
 *      404:
 *        description: Cette recette n'existe pas.
 *      500:
 *        description: Le serveur ne répond pas.
 *
 *   delete:
 *     summary: Suppression de la recette en fonction de l'id
 *     tags: [Recettes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id de la recette
 *
 *     responses:
 *       200:
 *         description: La recette a bien été supprimée.
 *       404:
 *         description: Recette introuvable
 */

const { authJwt, verifyCategory } = require("../middleware");
const controller = require("../controllers/recipe.controller");
const errors = require("../services/errors.services");


module.exports = function(app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/recipes/",
        [authJwt.verifyToken, verifyCategory.checkCategoryExisted],
        controller.postRecipe
    );

    app.get(
        "/api/recipes/",
        [authJwt.verifyToken],
        controller.getRecipes
    );

    app.get(
        "/api/recipes/:id",
        [authJwt.verifyToken, errors.isRecipeIdExisting],
        controller.getOneRecipe
    );

    app.patch(
        "/api/recipes/:id",
        [authJwt.verifyToken, errors.isRecipeIdExisting],
        controller.patchRecipe
    );

    app.delete(
        "/api/recipes/:id",
        [authJwt.verifyToken, errors.isRecipeIdExisting],
        controller.deleteOneRecipe
    );
};
