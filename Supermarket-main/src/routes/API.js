const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ------------------ PRODUCT ROUTES ------------------

// Get all products
router.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Product");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a single product by ID
router.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT p.*, c.Name AS categoryname
       FROM Product p
       LEFT JOIN Category c ON p.CategoryID = c.CategoryID
       WHERE p.ProductID = $1`,
      [id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new product (with image)
router.post("/products", upload.single("image"), async (req, res) => {
  const { name, price, remaining, categoryid } = req.body;
  const imageurl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  try {
    await pool.query(
      `INSERT INTO Product (Name, Price, Remaining, CategoryID, ImageURL, CreatedAt, Sold)
       VALUES ($1,$2,$3,$4,$5,NOW(),0)`,
      [name, price, remaining || 0, categoryid || null, imageurl]
    );
    res.status(201).json({ message: "Product created successfully" });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ------------------ CUSTOMER ROUTES ------------------

// Get all customers
router.get("/customers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Customer");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a customer by UserID
router.get("/customers/by-user/:userid", async (req, res) => {
  const { userid } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Customer WHERE UserID = $1", [userid]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching customer by userId:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update customer profile
router.put("/customers/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phonenumber, address } = req.body;
  try {
    const result = await pool.query(
      `UPDATE Customer
       SET Name=$1, Email=$2, PhoneNumber=$3, Address=$4
       WHERE CustomerID=$5
       RETURNING *`,
      [name, email, phonenumber, address, id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating customer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// ------------------ PROFILE ROUTES ------------------

// Get customer profile by UserID
router.get("/profile/customer/:userid", async (req, res) => {
  const { userid } = req.params;
  try {
    const cust = await pool.query(
      `SELECT customerid, name, phonenumber, email, address
       FROM Customer
       WHERE UserID = $1`,
      [userid]
    );
    if (!cust.rows.length) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(cust.rows[0]);
  } catch (err) {
    console.error("Error fetching customer profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/orders', async (req, res) => {
  const { customerID, productID, paymentmethod } = req.body;
  console.log("Received order request with:", req.body);

  try {
    // 1) Look up the customer’s address
    const customerResult = await pool.query(
      'SELECT address FROM Customer WHERE CustomerID = $1',
      [customerID]
    );
    if (!customerResult.rows.length) {
      return res.status(400).json({ error: "Invalid customer ID" });
    }
    const address = customerResult.rows[0].address;

    // 2) Insert into OrderTable with the correct binding order:
    //    (orderdate, address, status, customerid, productid, paymentmethod)
    const orderRes = await pool.query(
      `INSERT INTO OrderTable
         (orderdate, address, status, customerid, productid, paymentmethod)
       VALUES
         (CURRENT_DATE, $1, $2, $3, $4, $5)
       RETURNING *`,
      [
        address,            // $1 → address
        'Pending',          // $2 → status (your enum)
        customerID,         // $3 → customerid
        productID,          // $4 → productid
        paymentmethod       // $5 → paymentmethod
      ]
    );

    const orderID = orderRes.rows[0].orderid;
    res.status(201).json({ message: "Order created successfully", orderID });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});



// ------------------ CATEGORY ROUTES ------------------

// Get all categories
router.get("/categories", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Category");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET endpoint to fetch orders by customer ID
router.get('/customers/:customerid/orders', async (req, res) => {
  const { customerid } = req.params;
  
  try {
    // Query to get all orders for a specific customer
    const result = await pool.query(
      `SELECT * FROM OrderTable
       WHERE customerid = $1
       ORDER BY orderdate DESC`,
      [customerid]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching customer orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});
module.exports = router;