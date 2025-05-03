import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js"; // Lấy kết nối PostgreSQL

const router = express.Router();

// Route đăng ký người dùng
// Route đăng ký người dùng
router.post("/register", async (req, res) => {
  const { username, password, email, phonenumber, address, role } = req.body;

  try {
    // Kiểm tra xem username đã tồn tại chưa
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Mã hóa password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Insert user vào database với role
    const insertUser = await db.query(
      `
      INSERT INTO users (username, password, email, phonenumber, address, role)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
    `,
      [username, hashedPassword, email, phonenumber, address, role]
    );

    const userId = insertUser.rows[0].id;

    // Tạo token cho user
    const token = jwt.sign(
      { id: userId, username, role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.json({ token });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// Route đăng nhập
// Route đăng nhập
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Kiểm tra xem user có tồn tại trong database không
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = result.rows[0];

    // Kiểm tra mật khẩu có đúng không
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Tạo token cho user với role
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// Middleware xác thực JWT
// Middleware xác thực JWT
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // lưu thông tin người dùng vào req.user
    next(); // cho phép đi tiếp
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Protected route example
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      `
      SELECT id, username, email, phonenumber, address, role 
      FROM users WHERE id = $1
    `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to get profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
