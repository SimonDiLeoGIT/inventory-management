const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UserModel = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    roleId: { type: DataTypes.INTEGER, allowNull: true },
  });

  UserModel.associate = (models) => {
    UserModel.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "role",
    });

    UserModel.hasMany(models.Movement, {
      foreignKey: "userId",
    });

    UserModel.addScope("withRole", {
      include: [
        {
          model: models.Role,
          as: "role",
          attributes: ["name"],
        },
      ],
    });
  };

  return UserModel;
};
