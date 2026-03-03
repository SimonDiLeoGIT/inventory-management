const router = require("express").Router();
const UserController = require("./user.controller");
const { check } = require("../../middlewares/auth.middleware");

router.get("/", check, UserController.getUser);
router.get("/all", check, UserController.getAllUsers);

module.exports = router;
