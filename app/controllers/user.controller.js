const db = require("../models");
const userRepository = db.user;
const Op = db.Sequelize.Op;
const {authJwt} = require("../middleware");
const bcrypt = require("bcryptjs");

// Changement des informations utilisateur
exports.patchUser = async (req, res) => {
    // Récupération du user à modifier
    const userToModify = await userRepository.findByPk(req.params.id);

    // Organisation du body
    const credentials = {
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword || req.body.oldPassword,
        newEmail: req.body.newEmail || userToModify.email
    }

    // Comparaison des mots de passe criptés
    let passwordIsValid = bcrypt.compareSync(
        credentials.oldPassword,
        userToModify.password
    );

    // Vérification qu'un user modifie ses propres informations
    if (req.userId == req.params.id) {
        // Validation de l'exhaustivité des informations à modifer
        if (!credentials.oldPassword) {
            res.status(400).send({
                message: "Il manque le mot de passe actuel pour valider la modification."
            });
        }

        // Vérification de l'ancien mot de passe
        else if (!passwordIsValid) {
            res.status(400).send({
                message: "Le mot de passe actuel est erroné."
            });
        }

        // Modification des informations si tout est ok
        else {
            // Utilisation de .update avec un body déclaré à la main
            await userRepository.update({
                username: userToModify.username,
                email: credentials.newEmail,
                password: bcrypt.hashSync(credentials.newPassword, 8)
            },
                {
                    where : {id: req.params.id}
                }).catch(err => {
                res.status(500).send({
                    message: "Erreur dans le changement d'identifiants pour l'id=" + req.params.id
                })});
            res.status(200).send({
                message: "Les informations de l'utilisateur ont été changées."
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