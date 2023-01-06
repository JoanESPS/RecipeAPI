const db = require("../models");
const userRepository = db.user;

isIdExisting = (req, res, next) => {
    const id = req.params.id;
    userRepository.findOne({
        where: {id: id}
    })
        .then(
            user => {
                if (!user) {
                    return res.status(404).send({
                        message: "Utilisateur non trouvé"
                    })
                }
                next();
            })
        .catch(err => {
            res.status(500).send({
                message: "Le serveur ne répond pas"
            });
        });
}

const errors = {
    isIdExisting: isIdExisting
};

module.exports = errors;