const cors = require("cors");
const express = require("express");
bodyParser = require("body-parser");
swaggerJsdoc = require("swagger-jsdoc");
swaggerUi = require("swagger-ui-express");


const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to RecipeAPI application." });
});

const db = require("./app/models");
const Role = db.role;
const Category = db.categories;


db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Db');
    initial()
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/recipe.routes')(app);
require('./app/routes/category.routes')(app);

// Définition du port (variable environnement ou 8080 par défaut
const PORT = parseInt(process.env.PORT) || 8081;

// paramètres de swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "LogRocket Express API with Swagger",
            version: "0.1.0",
            description:
                "API Express & Sequelize documentée avec Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "LogRocket",
                url: "https://logrocket.com",
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
    console.log(`Server is running : http://localhost:${PORT}/`);
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
        name: "vegan"
    });

    Category.create({
        name: "hot"
    });

    Category.create({
        name: "cold"
    });
}