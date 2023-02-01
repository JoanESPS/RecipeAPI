/**
 * @swagger
 * components:
 *   schemas:
 *     UserGet:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Id unique
 *         username:
 *           type: string
 *           description: Pseudo utilisateur
 *         email:
 *           type: string
 *           description: Adresse e-mail de l'utilisateur
 *         password:
 *           type: string
 *           description: Mot de passe de l'utilisateur
 *         createdAt:
 *           type: string
 *           description: Date de création
 *         updatedAt:
 *           type: string
 *           description: Date de la dernière modification
 *       example:
 *         id: 1
 *         username: Thomas-MORGANA
 *         email: thomas.morgana33@ynov.com
 *         password: 123456
 *         createdAt: 2023-02-01T14:35:33.000Z
 *         updatedAt: 2023-02-01T14:35:33.000Z
 *
 *     UserPatch:
 *       type: object
 *       properties:
 *         oldPassword:
 *           type: string
 *           description: Ancien mot de passe de l'utilisateur
 *         newPassword:
 *           type: string
 *           description: Nouveau mot de passe de l'utilisateur
 *         newEmail:
 *           type: string
 *           description: Nouvel email de l'utilisateur
 *       example:
 *         oldPassword: 123456
 *         newPassword: 1234567
 *         newEmail: thomas.morgana@ynov.com
 *
 *     UserPut:
 *       type: object
 *       properties:
 *         oldPassword:
 *           type: string
 *           description: Ancien mot de passe de l'utilisateur
 *         newPassword:
 *           type: string
 *           description: Nouveau mot de passe de l'utilisateur
 *         newEmail:
 *           type: string
 *           description: Nouvel email de l'utilisateur
 *       example:
 *         oldPassword: 123456
 *         newPassword: 1234567
 *         newEmail: thomas.morgana@ynov.com
 */

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestionnaire des utilisateurs
 * /api/users:
 *   get:
 *     summary: Récupération de tous les utilisateurs
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Liste de tous les utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserGet'
 *       500:
 *         description: Le serveur ne répond pas.
 *
 * /api/users/{id}:
 *   get:
 *     summary: Récupération d'un user par son id
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id de l'utilisateur
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserGet'
 *       404:
 *         description: L'utilisateur n'existe pas.
 *
 *   patch:
 *    summary: Mise à jour des informations en fonction de l'id
 *    tags: [Utilisateurs]
 *    parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id de l'utilisateur
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPatch'
 *    responses:
 *      200:
 *        description: Les informations de l'utilisateur ont été changées.
 *      404:
 *        description: Cet utilisateur n'existe pas.
 *      500:
 *        description: Le serveur ne répond pas.
 *
 *   put:
 *    summary: Mise à jour des informations en fonction de l'id
 *    tags: [Utilisateurs]
 *    parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id de l'utilisateur
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPut'
 *    responses:
 *      200:
 *        description: Les informations de l'utilisateur' ont été changées.
 *      404:
 *        description: Cet utilisateur n'existe pas.
 *      500:
 *        description: Le serveur ne répond pas.
 *
 *   delete:
 *     summary: Suppression de l'utilisateur' en fonction de l'id
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id de l'utilisateur
 *     responses:
 *       200:
 *         description: L'utilisateur' a bien été supprimée.
 *       404:
 *         description: Utilisateur introuvable
 */

const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const errors = require("../services/errors.services");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/api/users/",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getAllUsers
    )

    app.get(
        "/api/users/:id",
        [authJwt.verifyToken, authJwt.isAdmin, errors.isUserIdExisting],
        controller.getOneUser
    )

    app.patch(
        "/api/users/:id",
        [authJwt.verifyToken, errors.isUserIdExisting],
        controller.patchUser
    );

    app.put(
        "/api/users/:id",
        [authJwt.verifyToken, authJwt.isAdmin, errors.isUserIdExisting],
        controller.putUser
    );

    app.delete(
        "/api/users/:id",
        [authJwt.verifyToken, authJwt.isAdmin, errors.isUserIdExisting],
        controller.deleteUser
    )
};