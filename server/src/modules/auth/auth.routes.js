const router = require("express").Router();
const AuthController = require("./auth.controller");

router.post("/signup", AuthController.register);
router.post("/login", AuthController.login);
router.get("/me", AuthController.me);

module.exports = router;
