import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /api/products - lấy tất cả products
router.get("/products", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products");
    const products = result.rows;
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to get products" });
  }
});
router.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`SELECT * FROM products WHERE id = $1`, [id]);
    const product = result.rows[0];

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/customers", async (req, res) => {
  try {
    // Get users with role 'Customer'
    const result = await db.query("SELECT id, username, email, phonenumber, address FROM users WHERE role = 'Customer'");
    res.json(result.rows);
  } catch (error) {
    console.error("Failed to get customers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// GET /todos/products/search - Tìm kiếm sản phẩm theo keyword
router.get("/products/search", async (req, res) => {
  const { q } = req.query;
  
  try {
    if (!q || q.trim() === '') {
      // Nếu không có từ khóa tìm kiếm, trả về tất cả sản phẩm (có giới hạn)
      const result = await db.query("SELECT * FROM products LIMIT 20");
      return res.json(result.rows);
    }
    
    // Tìm kiếm sản phẩm theo tên và mô tả
    const result = await db.query(
      `SELECT * FROM products 
       WHERE name ILIKE $1 OR description ILIKE $1 
       LIMIT 20`,
      [`%${q}%`]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Failed to search products" });
  }
});
router.get("/categories", async (req, res) => {
  try {
    // Truy vấn tất cả danh mục từ bảng Categories
    const result = await db.query("SELECT * FROM Categories");

    // Kiểm tra nếu không có danh mục nào
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    // Trả về danh sách các danh mục
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// GET /api/profile/customer/:id - lấy thông tin user theo id
router.get("/profile/customer/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT id, username, email, phonenumber, address FROM users WHERE id = $1`,
      [id]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Failed to get customer profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET tất cả todos (có thể sửa thêm lọc theo user sau)
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM todos");
    const todos = result.rows;
    res.json(todos);
  } catch (error) {
    console.error("Failed to get todos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST tạo mới todo
router.post("/", async (req, res) => {
  const { user_id, task } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO todos (user_id, task, completed) VALUES ($1, $2, $3) RETURNING *`,
      [user_id, task, false]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to create todo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT cập nhật todo
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;
  try {
    const result = await db.query(
      `UPDATE todos SET task = $1, completed = $2 WHERE id = $3 RETURNING *`,
      [task, completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update todo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE todo
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `DELETE FROM todos WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Failed to delete todo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// POST /todos/orders - Tạo đơn hàng mới
router.post("/orders", async (req, res) => {
  console.log("hellooo");

  const { customerID, productID, paymentmethod } = req.body;
  console.log("customerID", customerID);
  // Validate dữ liệu
  if (!customerID || !productID || !paymentmethod) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Lấy thông tin sản phẩm để tính giá tiền
    const productResult = await db.query(
      `SELECT price FROM Products WHERE id = $1`,
      [productID]
    );
    const product = productResult.rows[0];

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productPrice = product.price;

    // Bắt đầu transaction
    await db.query("BEGIN");

    // 1. Tạo đơn hàng
    const orderResult = await db.query(
      `
  INSERT INTO Orders (customer_id, total_cost, status)
  VALUES ($1, $2, $3)
  RETURNING id
`,
      [customerID, productPrice, "Pending"]
    );
    const orderID = orderResult.rows[0].id;

    // 2. Ghi chi tiết đơn hàng
    await db.query(
      `
  INSERT INTO OrderDetails (order_id, product_id, quantity)
  VALUES ($1, $2, $3)
`,
      [orderID, productID, 1]
    );

    // 3. Trừ số lượng sản phẩm
    await db.query(
      `
  UPDATE Products
  SET remaining = remaining - 1
  WHERE id = $1 AND remaining > 0
`,
      [productID]
    );

    // 4. Ghi thông tin thanh toán
    await db.query(
      `
  INSERT INTO Payments (order_id, payment_mode)
  VALUES ($1, $2)
`,
      [orderID, paymentmethod]
    );

    await db.query("COMMIT");

    res
      .status(201)
      .json({ message: "Order placed successfully", orderID: orderID });
  } catch (error) {
    console.error("Failed to place order:", error);
    await db.query("ROLLBACK");
    res.status(500).json({ message: "Internal server error" });
  }
});
// GET /api/orders/:id - Lấy thông tin đơn hàng theo ID
router.get("/orders/:customerId", async (req, res) => {
  const { customerId } = req.params;
  console.log("customerId", customerId);
  try {
    // Truy vấn tất cả đơn hàng của khách hàng với customerId
    const ordersResult = await db.query(
      `SELECT o.id, o.order_date, o.total_cost, o.status, u.username
       FROM Orders o
       JOIN Users u ON o.customer_id = u.id
       WHERE o.customer_id = $1`,
      [customerId]
    );

    const orders = ordersResult.rows;

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this customer" });
    }

    // Truy vấn chi tiết sản phẩm cho tất cả các đơn hàng của khách hàng
    const orderDetailsResult = await db.query(
      `SELECT od.order_id, od.product_id, p.name, p.price, od.quantity
       FROM OrderDetails od
       JOIN Products p ON od.product_id = p.id`
    );

    const orderDetails = orderDetailsResult.rows;

    // Cấu trúc dữ liệu để trả về
    const ordersWithDetails = orders.map((order) => {
      // Lọc các sản phẩm của đơn hàng hiện tại
      const products = orderDetails.filter(
        (detail) => detail.order_id === order.id
      );

      return {
        order: {
          id: order.id,
          order_date: order.order_date,
          total_cost: order.total_cost,
          status: order.status,
          customer_name: order.username,
        },
        products: products,
      };
    });

    // Trả về danh sách đơn hàng của khách hàng với các sản phẩm của chúng
    res.json(ordersWithDetails);
  } catch (error) {
    console.error("Error fetching orders for customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/ordersAll", async (req, res) => {
  console.log("hellooo1");

  const { customerID, products, paymentmethod } = req.body;
  console.log("customerID", customerID);

  // Validate dữ liệu
  if (!customerID || !products || !paymentmethod) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (products.length === 0) {
    return res.status(400).json({ message: "No products in the order" });
  }

  try {
    // Bắt đầu transaction
    await db.query("BEGIN");

    // 1. Lấy thông tin sản phẩm và tính tổng giá trị đơn hàng
    let totalCost = 0;
    const productDetails = [];

    for (const product of products) {
      const { productID, quantity } = product;

      // Lấy thông tin giá sản phẩm
      const productResult = await db.query(
        `SELECT price, remaining FROM Products WHERE id = $1`,
        [productID]
      );
      const productData = productResult.rows[0];

      if (!productData) {
        return res
          .status(404)
          .json({ message: `Product ${productID} not found` });
      }

      const productPrice = productData.price;
      const productRemaining = productData.remaining;

      if (quantity > productRemaining) {
        return res
          .status(400)
          .json({ message: `Not enough stock for product ${productID}` });
      }

      // Cộng dồn chi phí sản phẩm vào tổng chi phí
      totalCost += productPrice * quantity;

      // Thêm sản phẩm vào danh sách chi tiết đơn hàng
      productDetails.push({ productID, quantity });

      // Trừ số lượng sản phẩm
      await db.query(
        `UPDATE Products SET remaining = remaining - $1 WHERE id = $2 AND remaining >= $1`,
        [quantity, productID]
      );
    }

    // 2. Tạo đơn hàng
    const orderResult = await db.query(
      `INSERT INTO Orders (customer_id, total_cost, status)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [customerID, totalCost, "Pending"]
    );
    const orderID = orderResult.rows[0].id;

    // 3. Ghi chi tiết đơn hàng cho tất cả các sản phẩm
    for (const detail of productDetails) {
      await db.query(
        `INSERT INTO OrderDetails (order_id, product_id, quantity)
         VALUES ($1, $2, $3)`,
        [orderID, detail.productID, detail.quantity]
      );
    }

    // 4. Ghi thông tin thanh toán
    await db.query(
      `INSERT INTO Payments (order_id, payment_mode)
       VALUES ($1, $2)`,
      [orderID, paymentmethod]
    );

    // 5. Commit transaction
    await db.query("COMMIT");

    res
      .status(201)
      .json({ message: "Order placed successfully", orderID: orderID });
  } catch (error) {
    console.error("Failed to place order:", error);
    await db.query("ROLLBACK");
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
