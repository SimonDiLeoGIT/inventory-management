const db = require("../../models");
const { Op } = require("sequelize");

const Movement = db.Movement;
const Product = db.Product;
const User = db.User;

/**
 * Crear movimiento
 */
exports.createMovement = async (req, res) => {
  try {
    const { productId, type, quantity, reason } = req.body;

    const userId = req.user?.id || null;

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
      });
    }

    let newStock = product.stock;

    if (type === "IN") newStock += quantity;

    if (type === "OUT") {
      newStock -= quantity;

      if (newStock < 0) {
        return res.status(400).json({
          success: false,
          error: "Stock insuficiente",
        });
      }
    }

    if (type === "ADJUST") newStock = quantity;

    const movement = await Movement.create({
      productId,
      type,
      quantity,
      reason,
      userId,
    });

    await product.update({ stock: newStock });

    res.status(201).json({
      success: true,
      movement,
      newStock,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Obtener movimientos (paginado + filtros)
 */
exports.getMovements = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, productId, search = "" } = req.query;

    const offset = (page - 1) * limit;

    const where = {};

    if (type) where.type = type;

    if (productId) where.productId = productId;

    const productWhere = {};

    if (search) {
      productWhere[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Movement.findAndCountAll({
      where,

      include: [
        {
          model: Product,
          attributes: ["id", "name", "sku"],
          where: Object.keys(productWhere).length ? productWhere : undefined,
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      ],

      limit: Number(limit),
      offset: Number(offset),

      order: [["timestamp", "DESC"]],
    });

    res.json({
      success: true,
      movements: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Obtener movimiento por ID
 */
exports.getMovementById = async (req, res) => {
  try {
    const movement = await Movement.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ["id", "name", "sku"],
        },
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });

    if (!movement) {
      return res.status(404).json({
        success: false,
        error: "Movimiento no encontrado",
      });
    }

    res.json({
      success: true,
      movement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Eliminar movimiento
 */
exports.deleteMovement = async (req, res) => {
  try {
    const movement = await Movement.findByPk(req.params.id);

    if (!movement) {
      return res.status(404).json({
        success: false,
        error: "Movimiento no encontrado",
      });
    }

    await movement.destroy();

    res.json({
      success: true,
      message: "Movimiento eliminado",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
