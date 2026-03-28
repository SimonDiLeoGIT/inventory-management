const { format } = require("sequelize/lib/utils");
const db = require("../../models");
const Product = db.Product;
const Category = db.Category;
const { Op, col, fn, literal } = require("sequelize");

exports.getInventorySummary = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [
      totalProducts,
      totalCategories,
      lowStockProducts,
      todayMovements,
      inventoryValue,
    ] = await Promise.all([
      Product.count(),
      Category.count(),
      Product.count({
        where: {
          stock: { [Op.lt]: col("minStock") },
        },
      }),
      db.Movement.count({
        where: {
          createdAt: {
            [Op.gte]: today,
          },
        },
      }),
      Product.findOne({
        attributes: [
          [fn("SUM", literal("salePrice * stock")), "inventoryValue"],
        ],
        where: {
          stock: { [Op.gt]: 0 },
        },
        raw: true,
      }),
    ]);

    return Promise.resolve({
      totalProducts,
      totalCategories,
      lowStockProducts,
      todayMovements,
      inventoryValue: Number(inventoryValue?.inventoryValue ?? 0),
    });
  } catch (error) {
    throw error;
  }
};

exports.getLowStockProductsInternal = async () => {
  try {
    const lowStockProducts = await Product.findAll({
      where: {
        stock: { [Op.lt]: col("minStock") },
      },
    });
    return Promise.resolve(lowStockProducts);
  } catch (error) {
    throw error;
  }
};

exports.getCurentWeekSalesEvolution = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 6);

    const data = await db.Movement.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate,
        },
        type: "OUT",
      },
      attributes: [
        [
          fn("strftime", "%Y-%m-%d", col("movement.createdAt"), "-3 hours"),
          "date",
        ],
        [fn("SUM", col("movement.quantity")), "sales"],
        [
          fn(
            "SUM",
            literal("movement.quantity * COALESCE(product.salePrice, 0)"),
          ),
          "revenue",
        ],
      ],
      include: [
        {
          model: db.Product,
          attributes: [],
        },
      ],
      group: ["date"],
      order: [["date", "ASC"]],
      raw: true,
    });

    const daysMap = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

    // Convertir a mapa
    const dataMap = {};

    data.forEach((item) => {
      dataMap[item.date] = {
        sales: Number(item.sales),
        revenue: Number(item.revenue),
      };
    });

    // Merge
    let totalSales = 0;
    let totalRevenue = 0;

    const weekSales = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);

      const dateStr = d.toISOString().slice(0, 10);

      const found = dataMap[dateStr];

      const sales = found?.sales || 0;
      const revenue = found?.revenue || 0;

      totalSales += sales;
      totalRevenue += revenue;

      weekSales.push({
        label: daysMap[d.getDay()],
        sales,
        revenue,
      });
    }

    return {
      data: weekSales,
      weekSales: totalSales,
      weekRevenue: totalRevenue,
    };
  } catch (error) {
    throw error;
  }
};

exports.getTopProducts = async () => {
  try {
    const topProducts = await db.Movement.findAll({
      attributes: [
        "productId",
        [fn("SUM", col("movement.quantity")), "total"],
        [col("product.name"), "name"],
      ],
      include: [
        {
          model: db.Product,
          attributes: [],
        },
      ],
      where: {
        type: "OUT",
      },
      group: ["productId"],
      order: [[fn("SUM", col("movement.quantity")), "DESC"]],
      limit: 5,
      raw: true,
    });

    return Promise.resolve(topProducts);
  } catch (error) {
    throw error;
  }
};
