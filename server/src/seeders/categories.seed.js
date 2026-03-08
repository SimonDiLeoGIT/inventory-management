module.exports = async (db) => {
  const categories = [
    {
      name: "Bebidas",
      description: "Bebidas frías y calientes",
      color: "#3b82f6",
    },
    { name: "Alimentos", description: "Comida en general", color: "#22c55e" },
    { name: "Snacks", description: "Productos para picar", color: "#f59e0b" },
    {
      name: "Limpieza",
      description: "Productos de limpieza",
      color: "#06b6d4",
    },
    {
      name: "Higiene",
      description: "Productos de higiene personal",
      color: "#ec4899",
    },
  ];

  for (const category of categories) {
    const exists = await db.Category.findOne({
      where: { name: category.name },
    });

    if (!exists) {
      await db.Category.create(category);
    }
  }

  console.log("✔ Categories seeded");
};
