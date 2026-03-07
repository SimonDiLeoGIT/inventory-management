const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const RoleModel = sequelize.define("role", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING, allowNull: true },
  });

  RoleModel.associate = (models) => {
    RoleModel.hasMany(models.User, {
      foreignKey: "roleId",
    });
  };

  return RoleModel;
};
