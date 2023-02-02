/**
 * @swagger
 * components:
 *   schemas:
 *     UserSignUp:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - roles
 *       properties:
 *         username:
 *           type: string
 *           description: Pseudo choisi par l'utilisateur
 *         email:
 *           type: string
 *           description: Email choisi par l'utilisateur
 *         password:
 *           type: string
 *           description: Mot de passe choisi par l'utilisateur
 *         roles:
 *           type: array
 *           description: Rôles définis pour l'utilisateur
 *       example:
 *         username: Thomas_Morgana
 *         email: thomas.morgana33@ynov.com
 *         password: 123456
 *         roles: [admin, moderator, user]
 *
 *     UserSignIn:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Id généré automatiquement par Sequelize
 *         username:
 *           type: string
 *           description: Pseudo choisi par l'utilisateur
 *         email:
 *           type: string
 *           description: Email choisi par l'utilisateur
 *         password:
 *           type: string
 *           description: Mot de passe choisi par l'utilisateur
 *         roles:
 *           type: array
 *           description: Rôles définis pour l'utilisateur
 *       example:
 *         id: 1
 *         username: Thomas_Morgana
 *         email: thomas.morgana33@ynov.com
 *         password: 123456
 *         roles: [admin, moderator, user]
 *
 */

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestionnaire des utilisateurs
 * /api/auth/signup:
 *   post:
 *     summary: Création d'un compte utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignUp'
 *     responses:
 *       201:
 *         description: L'utilisateur a bien été créé.
 *       500:
 *         description: Le serveur ne répond pas.
 *
 * /api/auth/signin:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSignIn'
 *       500:
 *         description: Le serveur ne répond pas.
 */

const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );

    app.post("/api/auth/signin", controller.signin);
};