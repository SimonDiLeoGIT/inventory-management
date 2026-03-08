const express = require("express");
const router = express.Router();

const movementController = require("./movement.controller");
const { checkAuth } = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/permission.middleware");

router.use(checkAuth);
router.use(role.is("admin", "user"));

router.post("/", movementController.createMovement);
router.get("/", movementController.getMovements);
router.get("/:id", movementController.getMovementById);
router.delete("/:id", movementController.deleteMovement);

module.exports = router;
