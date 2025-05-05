-- Tạo ENUM
CREATE TYPE RoleEnum AS ENUM ('Cashier', 'Consultant', 'Customer');
CREATE TYPE StatusEnum AS ENUM ('Pending', 'Delivered', 'Cancelled');
CREATE TYPE PaymentEnum AS ENUM ('Cash', 'Credit Card', 'Debit Card', 'Online');
CREATE TYPE CategoryType AS ENUM ('Electrics', 'Clothing', 'Food', 'Furniture', 'Stationery', 'Cosmetics', 'Toys');
CREATE TYPE Role AS ENUM ('Cashier', 'Consultant', 'Guest');

-- Bảng Employee
CREATE TABLE Employee (
    EmployeeID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15) UNIQUE,
    Role RoleEnum NOT NULL,
    Salary DECIMAL(10,2) CHECK (Salary >= 0)
);

-- Bảng Customer
CREATE TABLE Customer (
    CustomerID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15) UNIQUE,
    Email VARCHAR(100) UNIQUE,
    Address TEXT
);

-- Bảng MemberAccount
CREATE TABLE MemberAccount (
    AccountID SERIAL PRIMARY KEY,
    CustomerID INT REFERENCES Customer(CustomerID) ON DELETE CASCADE,
    Type VARCHAR(50) NOT NULL,
    Points INT CHECK (Points >= 0) DEFAULT 0,
    StartDate DATE NOT NULL,
    DueDate DATE NOT NULL
);

-- Bảng Users
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT,
    phonenumber TEXT,
    address TEXT,
    role RoleEnum NOT NULL -- 'Cashier' hoặc 'Consultant' hoặc 'Customer'
);

-- Bảng Categories
CREATE TABLE Categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Bảng Products
CREATE TABLE Products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL CHECK (price >= 0) NOT NULL,
    sold INTEGER DEFAULT 0,
    createdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image TEXT,
    type TEXT REFERENCES Categories(name) ON DELETE CASCADE,
    remaining INTEGER DEFAULT 0,
    description TEXT,
    pricesale REAL CHECK (pricesale >= 0) DEFAULT 0,
    warehouse TEXT
);

-- Bảng Orders
CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_id INT REFERENCES Users(id) ON DELETE SET NULL,
    total_cost DECIMAL(10,2) CHECK (total_cost >= 0),
    status StatusEnum DEFAULT 'Pending'
);

-- Bảng OrderDetails
CREATE TABLE OrderDetails (
    order_id INT REFERENCES Orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES Products(id) ON DELETE CASCADE,
    quantity INT CHECK (quantity > 0),
    PRIMARY KEY (order_id, product_id)
);

-- Bảng Payments
CREATE TABLE Payments (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(id) ON DELETE CASCADE,
    payment_mode PaymentEnum NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Consultant
CREATE TABLE Consultant (
    consult_id SERIAL PRIMARY KEY,
    consultant_id INT NOT NULL,
    FOREIGN KEY (consultant_id) REFERENCES Employee(EmployeeID) ON DELETE CASCADE
);

-- Bảng Consulting
CREATE TABLE Consulting (
    consult_id INT,
    customer_id INT,
    PRIMARY KEY (consult_id, customer_id),
    FOREIGN KEY (consult_id) REFERENCES Consultant(consult_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES Customer(CustomerID) ON DELETE CASCADE
);

-- Bảng Discount
CREATE TABLE Discount (
    discount_id SERIAL PRIMARY KEY,
    discount_level INT NOT NULL,
    condition_ceiling INT NOT NULL
);

-- Bảng ApplyDiscount
CREATE TABLE ApplyDiscount (
    discount_id INT,
    order_id INT,
    PRIMARY KEY (discount_id, order_id),
    FOREIGN KEY (discount_id) REFERENCES Discount(discount_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE
);

-- Bảng Cashier
CREATE TABLE Cashier (
    counter_id INT,
    cashier_id INT PRIMARY KEY,
    FOREIGN KEY (cashier_id) REFERENCES Employee(EmployeeID) ON DELETE CASCADE
);

-- Bảng WarrantyCard
CREATE TABLE WarrantyCard (
    card_id SERIAL,
    product_id INT NOT NULL,
    expiry_date INT NOT NULL,
    PRIMARY KEY (product_id, card_id),
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
);

-- Chèn dữ liệu mẫu vào Categories
INSERT INTO Categories (name)
VALUES 
    ('Electrics'),
    ('Clothing'),
    ('Food'),
    ('Furniture'),
    ('Stationery'),
    ('Cosmetics'),
    ('Toys');

-- Chèn dữ liệu mẫu vào Products
INSERT INTO Products (name, price, sold, createdate, image, type, remaining, description, warehouse)
VALUES 
    -- Electronics Category 
    ('4K Smart TV', 899.99, 45, NOW(), 'https://i.ibb.co/Vf9kb2w/4-K-Smart-TV.jpg', 'Electrics', 30, 'Ultra HD Smart TV with built-in streaming apps and voice control.', 'Cu Chi'),
    ('Bluetooth Speaker', 79.99, 120, NOW(), 'https://i.ibb.co/6RwWwL3r/Bluetooth-Speaker.jpg', 'Electrics', 85, 'Portable waterproof speaker with 24-hour battery life.', 'Hoc Mon'),
    ('Digital Camera', 449.99, 60, NOW(), 'https://i.ibb.co/VcVLtQvw/Digital-Camera.jpg', 'Electrics', 25, 'High-resolution digital camera with 4K video capabilities.', 'Cu Chi'),
    ('Wireless Earbuds', 129.99, 180, NOW(), 'https://i.ibb.co/V0WysBrG/Wireless-Earbuds.jpg', 'Electrics', 70, 'True wireless earbuds with noise cancellation and long battery life.', 'Hoc Mon'),
    ('Smart Watch', 199.99, 95, NOW(), 'https://i.ibb.co/VWfDJhsX/Smart-Watch.jpg', 'Electrics', 40, 'Fitness tracker and smartwatch with heart rate monitoring.', 'Cu Chi'),
    ('Elegant Watch', 250.0, 150, NOW(), 'https://i.ibb.co/C5WcSsNn/Elegant-Watch.jpg', 'Electrics', 75, 'An elegant wristwatch for all occasions.', 'Hoc Mon'),
    ('Gaming Laptop', 1500.0, 300, NOW(), 'https://i.ibb.co/Mkny1S1N/Gaming-Laptop.jpg', 'Electrics', 50, 'High-performance gaming laptop with RTX graphics.', 'Hoc Mon'),
    
    -- Clothing Category
    ('Winter Jacket', 149.99, 75, NOW(), 'https://i.ibb.co/NdTNSmRH/Winter-Jacket.jpg', 'Clothing', 60, 'Warm winter jacket with water-resistant exterior and cozy lining.', 'Hoc Mon'),
    ('Denim Jeans', 59.99, 210, NOW(), 'https://i.ibb.co/RGXKFb4H/Denim-Jeans.jpg', 'Clothing', 130, 'Classic straight-leg jeans in dark wash denim.', 'Cu Chi'),
    ('Cotton T-Shirt Set', 34.99, 250, NOW(), 'https://i.ibb.co/HDFTQXFG/Cotton-T-Shirt-Set.jpg', 'Clothing', 200, 'Pack of 3 premium cotton t-shirts in basic colors.', 'Hoc Mon'),
    ('Casual Sneakers', 69.99, 160, NOW(), 'https://i.ibb.co/cKtyq6h4/Casual-Sneakers.jpg', 'Clothing', 85, 'Comfortable everyday sneakers with memory foam insoles.', 'Cu Chi'),
    ('Running Shoes', 90.0, 200, NOW(), 'https://i.ibb.co/cKts6N3V/Running-Shoes.jpg', 'Clothing', 120, 'Durable and lightweight running shoes.', 'Hoc Mon'),
    
    -- Food Category 
    ('Organic Coffee Beans', 14.99, 320, NOW(), 'https://i.ibb.co/0j2WntYd/Organic-Coffee-Beans.jpg', 'Food', 150, 'Fair trade organic coffee beans, medium roast.', 'Hoc Mon'),
    ('Chocolate Gift Box', 29.99, 180, NOW(), 'https://i.ibb.co/xqJDY4h8/Chocolate-Gift-Box.jpg', 'Food', 120, 'Assorted gourmet chocolates in an elegant gift box.', 'Cu Chi'),
    ('Extra Virgin Olive Oil', 19.99, 140, NOW(), 'https://i.ibb.co/WvBJsGDh/Extra-Virgin-Olive-Oil.jpg', 'Food', 90, 'Cold-pressed extra virgin olive oil from Italian olives.', 'Hoc Mon'),
    ('Dried Fruit Mix', 9.99, 210, NOW(), 'https://i.ibb.co/sv5Kw7wh/Dried-Fruit-Mix.jpg', 'Food', 160, 'Mix of premium dried fruits including apricots, cranberries and mango.', 'Cu Chi'),
    ('Gourmet Tea Collection', 24.99, 130, NOW(), 'https://i.ibb.co/ZpfD31rs/Gourmet-Tea-Collection.jpg', 'Food', 110, 'Collection of 6 premium loose leaf teas in gift packaging.', 'Hoc Mon'),
    
    -- Furniture Category
    ('Sectional Sofa', 899.99, 25, NOW(), 'https://i.ibb.co/HTVhx4MR/Sectional-Sofa.jpg', 'Furniture', 15, 'L-shaped sectional sofa with removable cushion covers.', 'Cu Chi'),
    ('Coffee Table', 199.99, 60, NOW(), 'https://i.ibb.co/TDfW65YM/Coffee-Table.jpg', 'Furniture', 40, 'Modern coffee table with storage shelf and glass top.', 'Hoc Mon'),
    ('Bookshelf', 149.99, 50, NOW(), 'https://i.ibb.co/PsF8TJx2/Bookshelf.jpg', 'Furniture', 35, '5-tier bookshelf with adjustable shelves.', 'Cu Chi'),
    ('Bedside Table Set', 129.99, 70, NOW(), 'https://i.ibb.co/V0hXLJvv/Bedside-Table-Set.jpg', 'Furniture', 45, 'Set of 2 matching bedside tables with drawer storage.', 'Hoc Mon'),
    ('Modern Chair', 120.0, 50, NOW(), 'https://i.ibb.co/jP9bPSx6/Modern-Chair.jpg', 'Furniture', 100, 'A comfortable and modern chair for your living room.', 'Cu Chi'),
    
    -- Stationery Category https://drive.google.com/uc?export=view&id=
    ('Premium Notebook', 18.99, 230, NOW(), 'https://i.ibb.co/j9hj8BZH/Premium-Notebook.jpg', 'Stationery', 170, 'Hardcover notebook with premium paper and bookmark ribbon.', 'Cu Chi'),
    ('Fountain Pen', 39.99, 120, NOW(), 'https://i.ibb.co/Lhds928q/Fountain-Pen.jpg', 'Stationery', 80, 'Refillable fountain pen with medium nib and elegant case.', 'Hoc Mon'),
    ('Desk Organizer', 24.99, 160, NOW(), 'https://i.ibb.co/21P99xDY/Desk-Organizer.jpg', 'Stationery', 110, 'Multi-compartment desk organizer for stationery items.', 'Cu Chi'),
    ('Art Supply Kit', 49.99, 90, NOW(), 'https://i.ibb.co/kVDBXdTs/Art-Supply-Kit.jpg', 'Stationery', 70, 'Complete art kit with colored pencils, markers and sketching tools.', 'Hoc Mon'),
    ('Novel Book', 30.0, 400, NOW(), 'https://i.ibb.co/zHFgrWfj/Novel-Book.jpg', 'Stationery', 300, 'An engaging novel for avid readers.', 'Hoc Mon'),
    
    -- Cosmetics Category
    ('Facial Skincare Set', 79.99, 140, NOW(), 'https://i.ibb.co/xSgNFXFh/Facial-Skincare-Set.jpg', 'Cosmetics', 90, 'Complete facial care routine with cleanser, toner and moisturizer.', 'Cu Chi'),
    ('Makeup Brush Collection', 59.99, 160, NOW(), 'https://i.ibb.co/MDs9VMYx/Makeup-Brush-Collection.jpg', 'Cosmetics', 110, 'Set of 12 professional makeup brushes with travel case.', 'Hoc Mon'),
    ('Natural Hair Shampoo', 14.99, 220, NOW(), 'https://i.ibb.co/gLZwnd0R/Natural-Hair-Shampoo.jpg', 'Cosmetics', 160, 'Sulfate-free natural shampoo for all hair types.', 'Cu Chi'),
    ('Luxury Perfume', 89.99, 85, NOW(), 'https://i.ibb.co/6RfGnBhh/Luxury-Perfume.jpg', 'Cosmetics', 60, 'Designer perfume with notes of jasmine, vanilla and amber.', 'Hoc Mon'),
    
    -- Toys Category https://drive.google.com/uc?export=view&id=
    ('Building Blocks Set', 39.99, 170, NOW(), 'https://i.ibb.co/4Ryz1X6K/Building-Blocks-Set.jpg', 'Toys', 120, 'Creative building blocks set with 500 pieces in various colors.', 'Cu Chi'),
    ('Remote Control Car', 59.99, 140, NOW(), 'https://i.ibb.co/5W3WB16X/Remote-Control-Car.jpg', 'Toys', 85, 'High-speed remote control car with rechargeable battery.', 'Hoc Mon'),
    ('Educational Board Game', 29.99, 110, NOW(), 'https://i.ibb.co/zV1pdzKz/Educational-Board-Game.jpg', 'Toys', 75, 'Family board game that develops strategic thinking skills.', 'Cu Chi'),
    ('Plush Animal Collection', 19.99, 190, NOW(), 'https://i.ibb.co/jv2DN4B1/Plush-Animal-Collection.jpg', 'Toys', 130, 'Set of 3 soft plush animals for all ages.', 'Hoc Mon');