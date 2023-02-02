const cors = require("cors");
const express = require("express");
bodyParser = require("body-parser");
swaggerJsdoc = require("swagger-jsdoc");
swaggerUi = require("swagger-ui-express");

// Définition du port (variable environnement ou 8080 par défaut
const PORT = parseInt(process.env.PORT) || 8081;

const app = express();

var corsOptions = {
    origin: `http://localhost:${PORT}`
};

app.use(cors(corsOptions));

// parse des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const message = "Bienvenue sur RecipeAPI              " +
    "API de gestion de recettes de cuisines organisées par catégories." +
    "Le rôle de cette API est de pouvoir stocker les recettes de cuisines que l'on souhaite avec leur source (livre de cuisine ou lien internet)." +
    "Par ailleurs elle permet aussi de pouvoir faire de la recherche de recette de cuisine selon les catégories renseignées, par exemple on peut afficher toutes les recettes de cuisine qui sont italiennes. Plus il y a de catégories demandées, plus c'est restrictif." +
    "Cette API comporte 3 CRUD complet, les user, les recettes et les catégories." +
    "Le CRUD user permet de créer des comptes utilisateurs, modérateurs ou administrateurs avec des autorisations différentes. On peut se connecter à ces comptes via un mot de passe et récupérer un JSON web token." +
    "Les users peuvent utiliser les CRUD de recettes et catégories complets avec une restriction sur les PUT et DELETE qui ne fonctionnent que sur les recettes ajoutées par eux-même. Concernant le CRUD user, ils peuvent seulement modifier leur propre compte et se connecter." +
    "Les modérateurs peuvent eux, en plus des possibilités des users, modifier et supprimer les recettes de n'importe quel user." +
    "Les admins ont en plus des possibilités des moderateurs un accès en suppression, en modification et en visualisation des comptes user (le mot de passe sont crypté, personne n'y a accès)." +
    `Le lien du swagger pour afficher les routes et détails de fonctionnement de l'application: http://localhost:${PORT}/api-docs/`


// simple route
app.get("/", (req, res) => {
    res.json({ message: message });
});

const db = require("./app/models");
const Role = db.role;
const Category = db.categories;
const Recipe = db.recipe;


db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Db');
    initial()
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/recipe.routes')(app);
require('./app/routes/category.routes')(app);



// paramètres de swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "RecipeAPI Express API with Swagger",
            version: "1.0.0",
            description:
                "API Express & Sequelize documentée avec Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Joan et Nicolas",
                url: `http://localhost:${PORT}`,
                email: "info@email.com",
            },
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ["./app/routes/*.js"],
};


// Lancement de swagger
const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

// Ajout d'une barre de navigation
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);


// Lancement de l'app

app.listen(PORT, () => {
    console.log(`Le serveur est en ligne : http://localhost:${PORT}/`);
});

function initial() {
    Role.create({
        id: 1,
        name: "user"
    });

    Role.create({
        id: 2,
        name: "moderator"
    });

    Role.create({
        id: 3,
        name: "admin"
    });

    Category.create({
        name: "italian"
    });

    Category.create({
        name: "french"
    });

    Category.create({
        name: "asian"
    });

    Category.create({
        name: "vegetarian"
    });

    Category.create({
        name: "hot"
    });

    Category.create({
        name: "cold"
    });

    Recipe.create({
        name: "pasta alla bolognese",
        source: "Livre de recette italienne, page 15",
        prepTime: 30,
        comment: "C'est super bon !"
    });

    Recipe.create({
        name: "salade de chèvre chaud",
        source: "https://www.marmiton.org/recettes/recette_salade-de-chevre-chaud-miel-et-noix_228075.aspx",
        prepTime: 15,
        comment: "C'est super bon !"
    });

    Recipe.create({
        name: "boeuf bourguignon",
        source: "Livre de recette de mamie, page 8",
        prepTime: 150,
        comment: "C'est super bon !"
    });


    Recipe.create({
        name: "quiche lorraine",
        source: "https://www.marmiton.org/recettes/recette_quiche-lorraine-de-sophie_57113.aspx",
        prepTime: 45,
        comment: "C'est super bon !"
    });

    Recipe.create({
        name: "oeuf au plat",
        source: "Livre sur les oeufs, page 19",
        prepTime: 5,
        comment: "C'est super bon !"
    });
}