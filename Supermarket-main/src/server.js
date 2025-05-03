const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Import route modules
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/API");

// Middleware
app.use(cors({ origin: "http://localhost:3000" })); 
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/auth", authRoutes);        
app.use("/api", productRoutes);      

// 404 Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
