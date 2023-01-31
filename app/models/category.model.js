module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("categories", {
        name: {
            type: Sequelize.STRING,
            defaultValue: ""
        }
    })
    return Category;
};