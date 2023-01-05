module.exports = (sequelize, Sequelize) => {
    const RecipeIngredient = sequelize.define("users", {
        idIngredient: {
            type: Sequelize.INTEGER
        },
        idRecipe: {
            type: Sequelize.INTEGER
        }
    });

    return RecipeIngredient;
};