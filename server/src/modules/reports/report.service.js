const db = require("../../models");
const { Op, fn, col, literal } = require("sequelize");

exports.salesSummary = async () => {
  const totalSales = await db.Movement.count({
    where: { type: "OUT" },
  });

  const result = await db.Movement.findOne({
    attributes: [
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
    where: { type: "OUT" },
    raw: true,
  });

  return {
    totalSales,
    revenue: Number(result.revenue || 0),
  };
};

exports.salesEvolution = async (period, dateParam) => {
  const baseDate = dateParam ? new Date(dateParam) : new Date();

  let start, end, format, group;

  if (period === "day") {
    start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);

    format = "%Y-%m-%d";
  }

  if (period === "month") {
    start = new Date(baseDate.getFullYear(), 0, 1);
    end = new Date(baseDate.getFullYear(), 11, 31);

    format = "%m";
  }

  if (period === "year") {
    start = new Date(baseDate.getFullYear() - 5, 0, 1);
    end = new Date(baseDate.getFullYear(), 11, 31);

    format = "%Y";
  }

  group = literal(`strftime('${format}', movement.createdAt)`);

  const data = await db.Movement.findAll({
    attributes: [
      [group, "raw"],
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
    where: {
      type: "OUT",
      createdAt: { [Op.between]: [start, end] },
    },
    group: [group],
    order: [[literal("raw"), "ASC"]],
  });

  const map = new Map();

  data.forEach((d) => {
    map.set(d.dataValues.raw, {
      sales: Number(d.dataValues.sales),
      revenue: Number(d.dataValues.revenue),
    });
  });

  // DAY → días del mes
  if (period === "day") {
    const result = [];

    const daysInMonth = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth() + 1,
      0,
    ).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(baseDate.getFullYear(), baseDate.getMonth(), i);

      const key = date.toISOString().slice(0, 10);

      const found = map.get(key);

      const label = date
        .toLocaleDateString("es-AR", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
        .replace(".", "");

      result.push({
        label,
        sales: found ? found.sales : 0,
        revenue: found ? found.revenue : 0,
      });
    }

    return result;
  }

  // MONTH → meses del año
  if (period === "month") {
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];

    return months.map((m, i) => {
      const key = String(i + 1).padStart(2, "0");

      const found = map.get(key);

      return {
        label: m,
        sales: found ? found.sales : 0,
        revenue: found ? found.revenue : 0,
      };
    });
  }

  // YEAR → años
  if (period === "year") {
    const result = [];

    for (let i = -5; i <= 0; i++) {
      const year = baseDate.getFullYear() + i;
      const key = String(year);

      const found = map.get(key);

      result.push({
        label: key,
        sales: found ? found.sales : 0,
        revenue: found ? found.revenue : 0,
      });
    }

    return result;
  }
};

exports.topProducts = async (period, dateParam) => {
  const baseDate = dateParam ? new Date(dateParam) : new Date();

  let start, end;

  if (period === "day") {
    start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
  }

  if (period === "month") {
    start = new Date(baseDate.getFullYear(), 0, 1);
    end = new Date(baseDate.getFullYear(), 11, 31);
  }

  if (period === "year") {
    start = new Date(baseDate.getFullYear() - 5, 0, 1);
    end = new Date(baseDate.getFullYear(), 11, 31);
  }

  const result = await db.Movement.findAll({
    attributes: ["productId", [fn("sum", col("quantity")), "total"]],
    include: [
      {
        model: db.Product,
        attributes: ["name"],
      },
    ],
    where: {
      type: "OUT",
      createdAt: { [Op.between]: [start, end] },
    },
    group: ["productId"],
    order: [[fn("sum", col("quantity")), "DESC"]],
    limit: 5,
  });

  return result;
};

exports.salesByHour = async () => {
  const result = await db.Movement.findAll({
    attributes: [
      [fn("strftime", "%H", col("createdAt")), "hour"],
      [fn("sum", col("quantity")), "total"],
    ],

    where: { type: "OUT" },

    group: ["hour"],
    order: [["hour", "ASC"]],
  });

  return result;
};

exports.salesByCategory = async () => {
  const result = await db.Movement.findAll({
    attributes: [
      [col("product.category.name"), "name"],
      [col("product.category.color"), "color"],
      [fn("sum", col("quantity")), "value"],
    ],
    include: [
      {
        model: db.Product,
        attributes: [],
        include: [
          {
            model: db.Category,
            attributes: [],
          },
        ],
      },
    ],
    where: { type: "OUT" },
    group: ["product.categoryId"],
  });

  return result.map((r) => ({
    name: r.dataValues.name,
    value: Number(r.dataValues.value),
    color: r.dataValues.color,
  }));
};
