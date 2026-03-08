module.exports = async (db) => {
  const categories = await db.Category.findAll();

  const categoryMap = {};
  categories.forEach((c) => {
    categoryMap[c.name] = c.id;
  });

  const products = [
    {
      name: "Coca Cola 500ml",
      description: "Gaseosa Coca Cola",
      sku: "BEB-001",
      cost: 700,
      salePrice: 1200,
      stock: 50,
      minStock: 10,
      image: null,
      categoryId: categoryMap["Bebidas"],
    },
    {
      name: "Agua Mineral 500ml",
      description: "Agua mineral sin gas",
      sku: "BEB-002",
      cost: 400,
      salePrice: 800,
      stock: 60,
      minStock: 10,
      image: null,
      categoryId: categoryMap["Bebidas"],
    },
    {
      name: "Hamburguesa",
      description: "Hamburguesa clásica",
      sku: "ALI-001",
      cost: 2000,
      salePrice: 3500,
      stock: 25,
      minStock: 5,
      image: null,
      categoryId: categoryMap["Alimentos"],
    },
    {
      name: "Sandwich de Jamón y Queso",
      description: "Sandwich tostado",
      sku: "ALI-002",
      cost: 1400,
      salePrice: 2200,
      stock: 30,
      minStock: 5,
      image: null,
      categoryId: categoryMap["Alimentos"],
    },
    {
      name: "Papas Fritas",
      description: "Papas fritas saladas",
      sku: "SNK-001",
      cost: 900,
      salePrice: 1500,
      stock: 40,
      minStock: 10,
      image: null,
      categoryId: categoryMap["Snacks"],
    },
    {
      name: "Chocolate",
      description: "Barra de chocolate",
      sku: "SNK-002",
      cost: 700,
      salePrice: 1300,
      stock: 35,
      minStock: 10,
      image: null,
      categoryId: categoryMap["Snacks"],
    },
    {
      name: "Lavandina 1L",
      description: "Lavandina para limpieza",
      sku: "LIM-001",
      cost: 1200,
      salePrice: 2000,
      stock: 20,
      minStock: 5,
      image: null,
      categoryId: categoryMap["Limpieza"],
    },
    {
      name: "Detergente",
      description: "Detergente para platos",
      sku: "LIM-002",
      cost: 1000,
      salePrice: 1800,
      stock: 22,
      minStock: 5,
      image: null,
      categoryId: categoryMap["Limpieza"],
    },
    {
      name: "Shampoo",
      description: "Shampoo para cabello",
      sku: "HIG-001",
      cost: 1600,
      salePrice: 2600,
      stock: 15,
      minStock: 5,
      image: null,
      categoryId: categoryMap["Higiene"],
    },
    {
      name: "Jabón",
      description: "Jabón de tocador",
      sku: "HIG-002",
      cost: 400,
      salePrice: 900,
      stock: 40,
      minStock: 10,
      image: null,
      categoryId: categoryMap["Higiene"],
    },
  ];

  for (const product of products) {
    await db.Product.findOrCreate({
      where: { sku: product.sku },
      defaults: product,
    });
  }

  console.log("✔ Products seeded");
};
