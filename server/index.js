const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const uploadRoutes = require("./routes/upload");
const documentRoutes = require("./routes/documents");
const adminRoutes = require("./routes/admin");
const departmentRoutes = require("./routes/department");

const app = express();
const PORT = 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/department", departmentRoutes);

app.listen(PORT, () => {
  console.log(`DocFlow server running on http://localhost:${PORT}`);
});
