module.exports = (sequelize, Sequelize) => {
    const RecipeUser = sequelize.define("recipeUsers", {
        idRecipe: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING
        }
    });

    return RecipeUser;
};