const sequelize = require("../config/database");

const defineUser = require("../modules/users/user.model");
const defineRole = require("../modules/roles/role.model");
const defineCategory = require("../modules/categories/category.model");
const defineProduct = require("../modules/products/product.model");
const defineMovement = require("../modules/movements/movement.model");

const db = {};

db.User = defineUser(sequelize);
db.Role = defineRole(sequelize);
db.Category = defineCategory(sequelize);
db.Product = defineProduct(sequelize);
db.Movement = defineMovement(sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;
