const express = require("express");
const router = express.Router();
const reports = require("./report.controller");
const { checkAuth } = require("../../middlewares/auth.middleware");

router.get("/sales-summary", checkAuth, reports.salesSummary);
router.get("/sales-evolution", checkAuth, reports.salesEvolution);
router.get("/top-products", checkAuth, reports.topProducts);
router.get("/sales-by-hour", checkAuth, reports.salesByHour);
router.get("/sales-by-category", checkAuth, reports.salesByCategory);

module.exports = router;
