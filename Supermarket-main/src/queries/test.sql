-- Tạo bảng users
CREATE TYPE RoleEnum AS ENUM ('Cashier', 'Consultant', 'Customer');
CREATE TYPE StatusEnum AS ENUM ('Pending', 'Delivered', 'Cancelled');
CREATE TYPE PaymentEnum AS ENUM ('Cash', 'Credit Card', 'Debit Card', 'Online');
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT,
    phonenumber TEXT,
    address TEXT,
    role RoleEnum NOT NULL -- 'Cashier' hoặc 'Consultant' hoặc 'Customer'
);
-- Tạo bảng Categories
CREATE TABLE Categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);
-- Tạo bảng Products
CREATE TABLE Products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL CHECK (price >= 0) NOT NULL,
    sold INTEGER DEFAULT 0,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image TEXT,
    type TEXT REFERENCES Categories(name) ON DELETE CASCADE,
    remaining INTEGER DEFAULT 0,
    description TEXT,
    pricesale REAL CHECK (pricesale >= 0) DEFAULT 0,
    warehouse TEXT
);
-- Xóa dấu "," thừa ở đây
-- Tạo bảng Orders
CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_id INT REFERENCES Users(id),
    total_cost DECIMAL(10, 2) CHECK (total_cost >= 0),
    status StatusEnum DEFAULT 'Pending'
);
CREATE TABLE OrderDetails (
    order_id INT REFERENCES Orders(id),
    product_id INT REFERENCES Products(id),
    quantity INT CHECK (quantity > 0),
    PRIMARY KEY (order_id, product_id)
);
CREATE TABLE Payments (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(id),
    payment_mode PaymentEnum NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Chèn dữ liệu vào bảng Categories
INSERT INTO Categories (name)
VALUES ('Electris'),
    ('Clothing'),
    ('Food'),
    ('Furniture'),
    ('Stationery'),
    ('Cosmetics'),
    ('Toys');
-- Chèn dữ liệu vào bảng Products
INSERT INTO Products (
        name,
        price,
        sold,
        createdat,
        image,
        type,
        remaining,
        description,
        warehouse
    )
VALUES -- Modern Chair
    (
        'Modern Chair',
        120.0,
        50,
        NOW(),
        'https://storage.googleapis.com/cs-demo-data/coderstore/product_1.jpg',
        'Furniture',
        100,
        'A comfortable and modern chair for your living room.',
        'Cu Chi'
    ),
    -- Elegant Watch
    (
        'Elegant Watch',
        250.0,
        150,
        NOW(),
        'https://storage.googleapis.com/cs-demo-data/coderstore/product_2.jpg',
        'Electris',
        75,
        'An elegant wristwatch for all occasions.',
        'Hoc Mon'
    ),
    -- Running Shoes
    (
        'Running Shoes',
        90.0,
        200,
        NOW(),
        'https://storage.googleapis.com/cs-demo-data/coderstore/product_3.jpg',
        'Clothing',
        120,
        'Durable and lightweight running shoes.',
        'Hoc Mon'
    ),
    -- Gaming Laptop
    (
        'Gaming Laptop',
        1500.0,
        300,
        NOW(),
        'https://storage.googleapis.com/cs-demo-data/coderstore/product_4.jpg',
        'Electris',
        50,
        'High-performance gaming laptop with RTX graphics.',
        'Hoc Mon'
    ),
    -- Novel Book
    (
        'Novel Book',
        30.0,
        400,
        NOW(),
        'https://storage.googleapis.com/cs-demo-data/coderstore/product_5.jpg',
        'Stationery',
        300,
        'An engaging novel for avid readers.',
        'Hoc Mon'
    );