module.exports = async (db) => {
  const roles = [{ name: "admin" }, { name: "user" }];

  for (const role of roles) {
    const exists = await db.Role.findOne({
      where: { name: role.name },
    });

    if (!exists) {
      await db.Role.create(role);
    }
  }

  console.log("✔ Roles seeded");
};
