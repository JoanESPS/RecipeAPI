module.exports = (sequelize, Sequelize) => {
    const Recipe = sequelize.define("recipes", {
        name: {
            type: Sequelize.STRING
        },
        userId: {
            type: Sequelize.INTEGER
        },
        source: {
            type: Sequelize.STRING
        },
        prepTime: {
            type: Sequelize.INTEGER
        },
        comment: {
            type: Sequelize.STRING,
            defaultValue: ""
        }
    });

    return Recipe;
};