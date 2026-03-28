const db = require("../models");

exports.is =
  (...allowedRoles) =>
  async (req, res, next) => {
    const user = await db.User.scope("withRole").findByPk(req.user.id);

    console.log("User role:", user?.role?.name || "No role");

    if (!user || !user.role || !allowedRoles.includes(user.role.name)) {
      return res.status(403).json({
        error: `Requires one of these roles: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
