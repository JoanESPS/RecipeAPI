module.exports = (sequelize, Sequelize) => {
    const Ingredient = sequelize.define("ingredients", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            uniqueKey: true
        },
        alwaysAvailable: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        spring: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        summer: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        fall: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        winter: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        easyToFind: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    });

    return Ingredient;
};