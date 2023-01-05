module.exports = (sequelize, Sequelize) => {
    const RecipeIngredient = sequelize.define("recipeIngredients", {
        idIngredient: {
            type: Sequelize.INTEGER
        },
        idRecipe: {
            type: Sequelize.INTEGER
        }
    });

    return RecipeIngredient;
};