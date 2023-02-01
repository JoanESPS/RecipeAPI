const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: false,

        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.recipe = require("../models/recipe.model.js")(sequelize, Sequelize);
db.categories = require("../models/category.model.js")(sequelize, Sequelize);


//Création de la table de liaison utilisateur-rôle
db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

//Création de la table de liaison recette-catégorie
db.categories.belongsToMany(db.recipe, {
    through: "recipe_category",
    foreignKey: "categoryId",
    otherKey: "recipeId"
});
db.recipe.belongsToMany(db.categories, {
    through: "recipe_category",
    foreignKey: "recipeId",
    otherKey: "categoryId"
});

// Liste des rôles existants pour export
db.ROLES = ["user", "admin", "moderator"];


module.exports = db;