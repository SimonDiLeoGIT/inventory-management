const dashboardService = require("./dashboard.service");

exports.getDashboard = async (req, res) => {
  try {
    const [summary, lowStock, weekSalesEvolution, topProducts, categories] =
      await Promise.all([
        dashboardService.getInventorySummary(),
        dashboardService.getLowStockProductsInternal(),
        dashboardService.getCurentWeekSalesEvolution(),
        dashboardService.getTopProducts(),
        // getCategories(),
      ]);

    res.json({
      success: true,
      data: {
        summary,
        lowStock,
        weekSalesEvolution,
        topProducts,
        // categories,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// getSalesEvolution = async () => {};
// getTopProducts = async () => {};
// getCategories = async () => {};
// getLowStockProductsInternal = async () => {};
