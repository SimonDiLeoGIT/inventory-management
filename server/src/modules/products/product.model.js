const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Product = sequelize.define("product", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    sku: { type: DataTypes.STRING, unique: true },
    description: { type: DataTypes.TEXT },
    categoryId: { type: DataTypes.INTEGER },
    salePrice: { type: DataTypes.DECIMAL(10, 2) },
    cost: { type: DataTypes.DECIMAL(10, 2) },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    minStock: { type: DataTypes.INTEGER, defaultValue: 0 },
    image: { type: DataTypes.STRING },
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: "categoryId",
    });

    Product.hasMany(models.Movement, {
      foreignKey: "productId",
    });
  };

  return Product;
};
