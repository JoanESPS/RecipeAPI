const db = require("../models");
const userRepository = db.user;
const Op = db.Sequelize.Op;
const {authJwt} = require("../middleware");
const bcrypt = require("bcryptjs");

// Changement des informations utilisateur
exports.patchUser = async (req, res) => {
    // Organisation du body
    const password = {
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword
    }

    // Récupération du user à modifier
    const userToModify = await userRepository.findByPk(req.params.id);

    // Comparaison des mots de passe criptés
    let passwordIsValid = bcrypt.compareSync(
        password.oldPassword,
        userToModify.password
    );

    // Vérification qu'un user modifie ses propres informations
    if (req.userId == req.params.id) {
        // Validation de l'exhaustivité des informations à modifer
        if (!password.newPassword || !password.oldPassword) {
            res.status(400).send({
                message: "Il manque l'un des mots de passe dans la requête."
            });
        }

        // Vérification de l'ancien mot de passe
        else if (!passwordIsValid) {
            res.status(400).send({
                message: "L'ancien mot de passe est erroné."
            });
        }

        // Modification du mot de passe si tout est ok
        else {
            db.user.password = bcrypt.hashSync(req.body.newPassword, 8);
            res.status(200).send({
                message: "Le mot de passe a été changé."
            });
        }
    }

    // message d'erreur lorsqu'un user souhaite modifier les informations d'un autre user
    else {
        res.status(403).send({
            message: "Vous n'avez pas les droits nécessaires à cette action."
        })
    }
};





exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};