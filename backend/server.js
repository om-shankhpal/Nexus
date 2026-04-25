const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

const binRoutes = require("./routes/binRoutes");
const routeRoutes = require("./routes/routeRoutes");
const statsRoutes = require("./routes/statsRoutes");
const authRoutes = require("./routes/authRoutes");

const errorHandler = require("./middleware/errorHandler");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API running" });
});

app.use("/api/bins", binRoutes);
app.use("/api/route", routeRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch((err) => {
  console.error(err?.message ?? err);
  process.exit(1);
});
