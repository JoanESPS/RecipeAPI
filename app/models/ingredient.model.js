module.exports = (sequelize, Sequelize) => {
    const Ingredient = sequelize.define("roles", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            uniqueKey: true
        },
        alwaysAvailable: {
            type: Sequelize.BOOLEAN
        },
        spring: {
            type: Sequelize.BOOLEAN
        },
        summer: {
            type: Sequelize.BOOLEAN
        },
        fall: {
            type: Sequelize.BOOLEAN
        },
        winter: {
            type: Sequelize.BOOLEAN
        },
        easyToFind: {
            type: Sequelize.BOOLEAN
        },
    });

    return Ingredient;
};