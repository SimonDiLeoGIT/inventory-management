const router = require("express").Router();
const UserController = require("./user.controller");
const { checkAuth } = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/permission.middleware");

router.get("/", checkAuth, UserController.getUser);
router.get("/all", checkAuth, UserController.getAllUsers);
router.put(
  "/assign-role",
  checkAuth,
  role.is("admin"),
  UserController.assignRole,
);

module.exports = router;
