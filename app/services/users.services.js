const db = require("../models");
const userRepository = db.user;

// Service permettant de récupérer le opseudo d'un utilisateur à partir de son id
getUsername = async (req, res) => {
    const id = req.params.id;
    const username = await userRepository.findOne({
        where: {id: id}
    })
        .then(user => user.username)
    return username
}

const usersService = {
    getUsername: getUsername
}

module.exports = usersService;