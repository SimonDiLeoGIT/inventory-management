const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/users/user.routes");
const categoryRoutes = require("../modules/categories/category.routes");
const productRoutes = require("../modules/products/product.routes");
const movementRoutes = require("../modules/movements/movement.routes");
const reportRoutes = require("../modules/reports/report.routes");
const dashboardRoutes = require("../modules/dashoboard/dashboard.routes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/movements", movementRoutes);
router.use("/reports", reportRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
