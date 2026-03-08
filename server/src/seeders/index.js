const db = require("../models");

const categorySeeder = require("./categories.seed");
const roleSeeder = require("./roles.seed");
const productSeeder = require("./products.seed");

const runSeeders = async () => {
  try {
    await db.sequelize.sync();

    console.log("Running seeders...");

    await roleSeeder(db);
    await categorySeeder(db);
    await productSeeder(db);

    console.log("All seeders executed successfully");
  } catch (error) {
    console.error("Seeder error:", error);
  } finally {
    process.exit();
  }
};

runSeeders();
