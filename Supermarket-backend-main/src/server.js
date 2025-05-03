import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
//get the file path from the URL of current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//midlleware
app.use(express.json());
//serves the html file from the .public directory
app.use(express.static(path.join(__dirname, "../public")));

console.log(__dirname);
//serving up the html file from the .public directory
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
//routes
app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
