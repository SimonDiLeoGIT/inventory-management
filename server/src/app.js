const express = require("express");
const app = express();
const sequelize = require("./config/database");
const defineUser = require("./modules/users/user");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const User = defineUser(sequelize);
const cors = require("cors");
app.use(cors());

sequelize.sync();

app.use(express.json());

app.use("/", authRoutes);
app.use("/user", userRoutes);

app.get("/status", (req, res) => {
  res.json({
    status: "Running",
    timestamp: new Date().toISOString(),
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something went wrong",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
