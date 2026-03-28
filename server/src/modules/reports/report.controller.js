const reportsService = require("./report.service");

exports.salesSummary = async (req, res) => {
  try {
    const data = await reportsService.salesSummary();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.salesEvolution = async (req, res) => {
  const { period = "week" } = req.query;

  const data = await reportsService.salesEvolution(period);

  res.json({ success: true, data });
};

exports.topProducts = async (req, res) => {
  const { period, date } = req.query;
  const data = await reportsService.topProducts(period, date);
  res.json({ success: true, data });
};

exports.salesByHour = async (req, res) => {
  const data = await reportsService.salesByHour();
  res.json({ success: true, data });
};

exports.salesByCategory = async (req, res) => {
  const data = await reportsService.salesByCategory();
  res.json({ success: true, data });
};
