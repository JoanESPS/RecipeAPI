const { authJwt, verifyCategory } = require("../middleware");
const controller = require("../controllers/category.controller");
const errors = require("../services/errors.services");

module.exports = function(app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/categories/",
        [authJwt.verifyToken, verifyCategory.checkDuplicateCategory],
        controller.postCategory
    );

    app.get(
        "/api/categories/",
        [authJwt.verifyToken],
        controller.getCategories
    );

    app.put(
        "/api/categories/:id",
        [authJwt.verifyToken, errors.isCategoryIdExisting],
        controller.putCategory
    );

    app.delete(
        "/api/categories/:id",
        [authJwt.verifyToken, authJwt.isModeratorOrAdmin, errors.isCategoryIdExisting],
        controller.deleteOneCategory
    );

    app.delete(
        "/api/categories/",
        [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
        controller.deleteAllCategories
    );
};
