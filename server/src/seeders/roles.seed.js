module.exports = async (db) => {
  const roles = [{ name: "admin" }, { name: "user" }];

  await db.Role.bulkCreate(roles, {
    ignoreDuplicates: true,
  });

  console.log("✔ Roles seeded");
};
