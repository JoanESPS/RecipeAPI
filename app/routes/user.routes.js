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