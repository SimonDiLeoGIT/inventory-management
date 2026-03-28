const express = require("express");
const router = express.Router();

const dashboardController = require("./dashboard.controller");
const { checkAuth } = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/permission.middleware");

router.use(checkAuth);
router.use(role.is("admin", "user"));

router.get("/", dashboardController.getDashboard);

module.exports = router;
