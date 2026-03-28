const db = require("../../models");

exports.assignRole = async (req, res, next) => {
  try {
    const { userId, roleId } = req.body;

    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const role = await db.Role.findByPk(roleId);

    if (!role) {
      return res.status(404).json({
        error: "Role not found",
      });
    }

    user.roleId = roleId;

    await user.save();

    res.json({
      message: "Role assigned successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res) => {
  const user = await db.User.findByPk(req.user.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ success: true, data: user });
};

exports.getAllUsers = async (req, res) => {
  const users = await db.User.findAll();
  res.json({ success: true, data: users });
};

exports.updateMe = async (req, res) => {
  const user = await db.User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  await user.update({
    username: req.body.name,
    email: req.body.email,
  });
  res.json({
    success: true,
    data: user,
  });
};
