const db = require("../models");
const userRepository = db.user;
const bcrypt = require("bcryptjs");
const usersServices = require("../services/users.services")
const {Op} = require("sequelize");

//Récupérer les informations de tous les utilisateurs
exports.getAllUsers = (req, res) => {
    const username = req.query.username;
    let condition = username ? { title: { [Op.like]: `%${username}%` } } : null;

    userRepository.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Le serveur ne répond pas."
            });
        });
};

// Récupérer les informations d'un utilisateur
exports.getOneUser = (req, res) => {
    const id = req.params.id;

    userRepository.findByPk(id)
        .then(user => {
            if (user) {
                res.send(user);
            } else {
                res.status(404).send({
                    message: `L'utilisateur avec l'id ${id} n'existe pas.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Le serveur ne répond pas"
            });
        });
};

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

    // Comparaison des mots de passe cryptés
    let passwordIsValid = bcrypt.compareSync(
        credentials.oldPassword,
        userToModify.password
    );

    // Récupération du username
    const username = await usersServices.getUsername(req, res)

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
                    message: "Erreur dans le changement d'identifiants pour l'id: " + req.params.id
                })});
            res.status(200).send({
                message: `Les informations de ${username} ont été changées.`
            });
        }
    }

    // Message d'erreur lorsqu'un user souhaite modifier les informations d'un autre user
    else {
        res.status(403).send({
            message: "Vous n'avez pas les droits nécessaires à cette action."
        })
    }
};

// Changement des informations utilisateur intégrales par un admin
exports.putUser = async (req, res) => {
    // Récupération du user à modifier
    const id = req.params.id;

    // Récupération du username
    const username = await usersServices.getUsername(req, res)

    // Ecrasement des informations du compte cible par un admin
    userRepository.update({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,8),
        roles: req.body.roles
    }, {
        where: {id: id}
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                message: `Le compte associé à l'utilisateur ${username} (id: ${id}) a bien été mis à jour.`
            });
        } else {
            res.status(400).send({
                message: `Le compte associé à lutilisateur ${username} (id: ${id}) n'a pas été mis à jour.`
            });
        }
    })
        .catch(err => {
            res.status(500).send({
                message: "Le serveur ne répond pas"
            });
        });
};

exports.deleteUser = async (req, res) => {
    const id = req.params.id;

    // Récupération du nom de l'utilisateur
    const username = await usersServices.getUsername(req, res)

    // Suppression d'un compte utilisateur par un admin
    userRepository.destroy({
        where: {id: id}
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: `${username} (id: ${id}) a été supprimé.`
                });
            } else {
                res.status(400).send({
                    message: `${username} (id: ${id}) n'a pas pu être supprimé.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Le serveur ne répond pas"
            });
        });
}