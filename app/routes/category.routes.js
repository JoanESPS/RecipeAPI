/**
 * @swagger
 * components:
 *   schemas:
 *     CategoryPost:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Le nom de la recette
 *       example:
 *         name: French
 *
 *     CategoryGet:
 *       type: object
 *       example:
 *         id: 1
 *         name: French
 *         createdAt: 2023-02-01T14:35:33.000Z
 *         updatedAt: 2023-02-01T14:35:33.000Z
 *
 *     CategoryPatch:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Le nom de la recette
 *       example:
 *         name: Savoyard
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gestionnaire de catégories de recettes
 * /api/categories:
 *   post:
 *     summary: Création d'une nouvelle catégorie
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryPost'
 *     responses:
 *       201:
 *         description: La catégorie a bien été créée
 *       500:
 *         description: Le serveur ne répond pas.
 *
 *   get:
 *     summary: Récupération de la liste des catégories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Liste de toutes les catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryGet'
 *
 * /api/categories/{id}:
 *
 *   get:
 *     summary: Récupération d'une catégorie par son id
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id de la catégorie
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryGet'
 *       404:
 *         description: La catégorie n'existe pas.
 *
 *   patch:
 *    summary: Mise à jour des informations en fonction de l'id
 *    tags: [Categories]
 *    parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id de la catégorie
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryPatch'
 *    responses:
 *      200:
 *        description: Les informations de la catégorie ont été changées.
 *      404:
 *        description: Cette catégorie n'existe pas.
 *      500:
 *        description: Le serveur ne répond pas.
 *
 *   delete:
 *     summary: Suppression de la catégorie en fonction de l'id
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id de la catégorie
 *
 *     responses:
 *       200:
 *         description: La catégorie a bien été supprimée.
 *       404:
 *         description: Recette introuvable
 */

const { authJwt, verifyCategory } = require("../middleware");
const controller = require("../controllers/category.controller");
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
        "/api/categories/",
        [authJwt.verifyToken, verifyCategory.checkDuplicateCategory],
        controller.postCategory
    );

    app.get(
        "/api/categories/",
        [authJwt.verifyToken],
        controller.getCategories
    );

    app.put(
        "/api/categories/:id",
        [authJwt.verifyToken, errors.isCategoryIdExisting],
        controller.putCategory
    );

    app.delete(
        "/api/categories/:id",
        [authJwt.verifyToken, authJwt.isModeratorOrAdmin, errors.isCategoryIdExisting],
        controller.deleteOneCategory
    );
};
