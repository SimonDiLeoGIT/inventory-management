const db = require("../../models");

const Category = db.Category;

// Crear categoría
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
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener todas
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();

    res.json({
      success: true,
      categories: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener por id
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
      category: category,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar
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
      category: category,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar
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
