const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Movement = sequelize.define("movement", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM("IN", "OUT", "ADJUST"), allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.STRING },
    userId: { type: DataTypes.INTEGER },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });

  Movement.associate = (models) => {
    Movement.belongsTo(models.Product, {
      foreignKey: "productId",
    });

    Movement.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };

  return Movement;
};
