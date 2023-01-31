const { authJwt, verifyCategory } = require("../middleware");
const controller = require("../controllers/recipe.controller");


module.exports = function(app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/recipes/",
        [authJwt.verifyToken, verifyCategory.checkCategoryExisted],
        controller.postRecipe
    );

    app.get(
        "/api/recipes/",
        [authJwt.verifyToken],
        controller.getRecipes
    );

    app.get(
        "/api/recipes/:id",
        [authJwt.verifyToken],
        controller.getOneRecipe
    );

    app.patch(
        "/api/recipes/:id",
        [authJwt.verifyToken],
        controller.patchRecipe
    );

    app.delete(
        "/api/recipes/:id",
        [authJwt.verifyToken],
        controller.deleteOneRecipe
    );
    app.delete(
        "/api/recipes/",
        [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
        controller.deleteAllRecipes
    );
};
