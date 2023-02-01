const db = require("../models");
const Category = db.categories


// Création d'une catégorie
exports.postCategory = (req, res) => {

    // Vérification des données saisies par le client
    if (!req.body.name) {
        res.status(400).send({
            message: "Veuillez donner un nom à la catégorie."
        });
        return;
    }

    Category.create({
        name: req.body.name,
    })
        .then(
            res.status(201).send({
                message: `La catégorie ${req.body.name} a bien été créée`
            })
        )
        .catch(err => {
            res.status(500).send({
                message : err.message || "Le serveur ne répond pas"
            });
        });
};


//Récupérer toutes les catégories
exports.getCategories = (req, res) => {
    Category.findAll({ where: null })
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

exports.putCategory = async (req, res) => {
    // Récupération de la catégorie à modifier
    const id = req.params.id;

    // Récupération du nom d'origine de la catégorie
    const name = await Category.findOne({
        where: {id: id}
    })
        .then(category => category.name)

    // Changement de nom de la catégorie
    Category.update({
        name: req.body.name
    }, {
        where: {id: id}
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                message: `La catégorie ${name} (id: ${id}) a bien été renommée en ${req.body.name}.`
            });
        } else {
            res.status(400).send({
                message: `La catégorie ${name} (id: ${id}) n'a pas été renommée en ${req.body.name}.`
            });
        }
    })
        .catch(err => {
            res.status(500).send({
                message: "Le serveur ne répond pas"
            });
        });
};


exports.deleteOneCategory = async (req, res) => {
    const id = req.params.id;

    // Récupération de la catégorie à supprimer
    const categoryToDelete = await Category.findByPk(req.params.id);
    const categoryName = await categoryToDelete.name;

    // Suppression d'une catégorie
    Category.destroy({
        where: {id: id}
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: `La catégorie ${categoryName} (id: ${id}) a été supprimée.`
                });
            } else {
                res.status(400).send({
                    message: `${categoryName} (id: ${id}) n'a pas pu être supprimée.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Le serveur ne répond pas."
            });
        });
};

exports.deleteAllCategories = async (req, res) => {

    // Suppression de toutes les catégories par un modérateur ou un admin
    Category.destroy({
        where: {}
    })
        .then(nums => {
            res.status(200).send({
                message: `Toutes les catégories ont été supprimées.`
            })
        })
        .catch(err => {
            res.status(500).send({
                message: "Le serveur ne répond pas"
            });
        });
}