let db = require('../models')
let Category = db.categories


checkCategoryExisted = async (req, res, next) => {
    let CATEGORIES = await Category.findAll({
        attributes: ['name']
    })
    CATEGORIES = CATEGORIES.map(categories => categories.dataValues.name)
    if (req.body.categories) {
        for (let i = 0; i < req.body.categories.length; i++) {
            if (!CATEGORIES.includes(req.body.categories[i])) {
                res.status(400).send({
                    message: "Erreur ! Cette catégorie n'existe pas : " + req.body.categories[i]
                });
                return;
            }
        }
    }

    next();
};

const verifyCategory = {
    checkCategoryExisted: checkCategoryExisted
};

module.exports = verifyCategory;