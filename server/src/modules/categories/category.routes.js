const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");
const { checkAuth } = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/permission.middleware");

router.use(checkAuth);
router.use(role.is("admin", "user"));

router.post("/", categoryController.createCategory);
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
