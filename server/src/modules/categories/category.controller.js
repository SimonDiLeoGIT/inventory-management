const db = require("../../models");
const { Op } = require("sequelize");

const Category = db.Category;

/**
 * Crear categoría
 */
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;

    const category = await Category.create({
      name,
      description,
      color,
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener categorías (con filtros y paginación)
 */
exports.getCategories = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
      where.name = {
        [Op.like]: `%${search}%`,
      };
    }

    const { count, rows } = await Category.findAndCountAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [["id", "ASC"]],
    });

    res.json({
      success: true,
      categories: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener categoría por id
 */
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.update(req.body);

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.destroy();

    res.json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    next(error);
  }
};
