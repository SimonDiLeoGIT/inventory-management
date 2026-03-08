const db = require("../../models");

const Movement = db.Movement;
const Product = db.Product;
const User = db.User;

/**
 * Crear movimiento
 */
exports.createMovement = async (req, res) => {
  try {
    const { productId, type, quantity, reason, userId } = req.body;

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
      });
    }

    // Calcular nuevo stock
    let newStock = product.stock;

    if (type === "IN") {
      newStock += quantity;
    }

    if (type === "OUT") {
      newStock -= quantity;

      if (newStock < 0) {
        return res.status(400).json({
          success: false,
          error: "Stock insuficiente",
        });
      }
    }

    if (type === "ADJUST") {
      newStock = quantity;
    }

    // Crear movimiento
    const movement = await Movement.create({
      productId,
      type,
      quantity,
      reason,
      userId,
    });

    // Actualizar stock
    await product.update({
      stock: newStock,
    });

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
 * Obtener todos los movimientos
 */
exports.getMovements = async (req, res) => {
  try {
    const movements = await Movement.findAll({
      include: [
        {
          model: Product,
          attributes: ["id", "name", "sku"],
        },
        {
          model: User,
          attributes: ["id", "name"],
        },
      ],
      order: [["timestamp", "DESC"]],
    });

    res.json({
      success: true,
      movements,
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
          attributes: ["id", "name"],
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
