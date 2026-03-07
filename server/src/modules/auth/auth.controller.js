const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const db = require("../../models");
const User = db.User;

const ajv = new Ajv();
addFormats(ajv);

const encryptPassword = (password) =>
  crypto.createHash("sha256").update(password).digest("hex");

const generateAccessToken = (username, userId) =>
  jwt.sign({ username, userId }, "your-secret-key", { expiresIn: "24h" });

exports.register = async (req, res) => {
  try {
    const schema = {
      type: "object",
      required: ["username", "email", "password"],
      properties: {
        username: { type: "string", minLength: 3 },
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 6 },
      },
    };
    const validate = ajv.compile(schema);
    if (!validate(req.body)) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: validate.errors });
    }
    const { username, email, password, firstName, lastName } = req.body;
    const encryptedPassword = encryptPassword(password);
    const user = await User.create({
      username,
      email,
      password: encryptedPassword,
      firstName,
      lastName,
    });
    const accessToken = generateAccessToken(username, user.id);
    res.status(201).json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email },
      token: accessToken,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.login = async (req, res) => {
  const schema = {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
    },
  };
  const validate = ajv.compile(schema);
  if (!validate(req.body)) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: validate.errors });
  }
  const { email, password } = req.body;
  const encrypted = encryptPassword(password);
  const user = await User.findOne({ where: { email } });
  if (!user || user.password !== encrypted)
    return res.status(401).json({ error: "Invalid credentials" });

  const username = user.username;
  const token = generateAccessToken(username, user.id);
  res.json({ success: true, user, token });
};

exports.me = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};
