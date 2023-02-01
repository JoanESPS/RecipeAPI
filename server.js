const express = require("express");
const cors = require("cors");


const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
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

// set port, listen for requests
const PORT = parseInt(process.env.PORT) || 8080;
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