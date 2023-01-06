const db = require("../models");
const userRepository = db.user;

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