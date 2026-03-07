const express = require("express");
const app = express();

const db = require("./models");
const routes = require("./routes");

const cors = require("cors");

app.use(cors());
app.use(express.json());

db.sequelize.sync();

app.use("/api", routes);

app.get("/status", (req, res) => {
  res.json({
    status: "Running",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
