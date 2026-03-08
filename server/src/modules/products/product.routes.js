const express = require("express");
const router = express.Router();

const productController = require("./product.controller");

const { checkAuth } = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/permission.middleware");

router.use(checkAuth);
router.use(role.is("admin", "user"));

router.post("/", productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
