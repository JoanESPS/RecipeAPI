module.exports = (sequelize, Sequelize) => {
    const Recipe = sequelize.define("recipes", {
        name: {
            type: Sequelize.STRING
        },
        source: {
            type: Sequelize.STRING
        },
        target: {
            type: Sequelize.STRING,
            defaultValue: ""
        },
        vegetarian: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        vegan: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        country: {
            type: Sequelize.STRING,
            defaultValue: ""
        },
        hot: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        cold: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        season: {
            type: Sequelize.STRING,
            defaultValue: ""
        },
        cookTime: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        prepTime: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        totalTime: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        difficulty: {
            type: Sequelize.STRING,
            defaultValue: ""
        },
        srcRating: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        userRating: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        tried: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        comment: {
            type: Sequelize.STRING,
            defaultValue: ""
        }
    });

    return Recipe;
};