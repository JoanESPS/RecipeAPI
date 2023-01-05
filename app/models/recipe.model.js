module.exports = (sequelize, Sequelize) => {
    const Recipe = sequelize.define("recipes", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        },
        source: {
            type: Sequelize.STRING
        },
        target: {
            type: Sequelize.STRING
        },
        vegetarian: {
            type: Sequelize.BOOLEAN
        },
        vegan: {
            type: Sequelize.BOOLEAN
        },
        country: {
            type: Sequelize.STRING
        },
        hot: {
            type: Sequelize.BOOLEAN
        },
        cold: {
            type: Sequelize.BOOLEAN
        },
        season: {
            type: Sequelize.STRING
        },
        cookTime: {
            type: Sequelize.INTEGER
        },
        prepTime: {
            type: Sequelize.INTEGER
        },
        totalTime: {
            type: Sequelize.INTEGER
        },
        difficulty: {
            type: Sequelize.STRING
        },
        srcRating: {
            type: Sequelize.INTEGER
        },
        userRating: {
            type: Sequelize.INTEGER
        },
        tried: {
            type: Sequelize.BOOLEAN
        },
        comment: {
            type: Sequelize.STRING
        }
    });

    return Recipe;
};