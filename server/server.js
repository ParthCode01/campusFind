require("dotenv").config();

const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const healthRoutes = require("./routes/healthRoutes");
const itemRoutes = require("./routes/itemRoutes");

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());
app.use("/api/health", healthRoutes);
app.use("/api/items", itemRoutes);
app.use(notFound);
app.use(errorHandler);

async function startServer() {
  await connectDB();

  app.listen(port, () => {
    console.log(`CampusFind API listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error(`Failed to start CampusFind API: ${error.message}`);
  process.exit(1);
});
