-- Định nghĩa ENUM
CREATE TYPE RoleEnum AS ENUM ('Cashier', 'Consultant');
CREATE TYPE CategoryType AS ENUM (
    'Electris',
    'Clothing',
    'Food',
    'Furniture',
    'Stationery',
    'Cosmetics',
    'Toys'
);
CREATE TYPE StatusEnum AS ENUM ('Pending', 'Delivered', 'Cancelled');
CREATE TYPE PaymentEnum AS ENUM ('Cash', 'Credit Card', 'Debit Card', 'Online');
CREATE TYPE Role AS ENUM ('Cashier', 'Consultant', 'Guest');
-- Bảng nhân viên
CREATE TABLE Employee (
    EmployeeID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15) UNIQUE,
    Role RoleEnum NOT NULL,
    Salary DECIMAL(10, 2) CHECK (Salary >= 0)
);
-- Bảng quầy thu ngân
CREATE TABLE Checkout (CounterID SERIAL PRIMARY KEY);
-- Bảng thu ngân
CREATE TABLE Cashier (
    EmployeeID INT PRIMARY KEY REFERENCES Employee(EmployeeID) ON DELETE CASCADE,
    CounterID INT NOT NULL REFERENCES Checkout(CounterID) ON DELETE
    SET NULL
);
-- Bảng tư vấn viên
CREATE TABLE Consultant (
    EmployeeID INT PRIMARY KEY REFERENCES Employee(EmployeeID) ON DELETE CASCADE
);
-- Bảng khách hàng
CREATE TABLE Customer (
    CustomerID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15) UNIQUE,
    Email VARCHAR(100) UNIQUE,
    Address TEXT
);
-- Bảng kho hàng
CREATE TABLE Warehouse (
    WarehouseID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL
);
-- Bảng danh mục sản phẩm
CREATE TABLE Category (
    CategoryID SERIAL PRIMARY KEY,
    WarehouseID INT REFERENCES Warehouse(WarehouseID) ON DELETE CASCADE,
    Name VARCHAR(100) NOT NULL,
    CategoryType CategoryTypeEnum NOT NULL
);
-- Bảng sản phẩm
CREATE TABLE Product (
    ProductID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Price DECIMAL(10, 2) CHECK (Price >= 0) NOT NULL,
    Remaining INT CHECK (Remaining >= 0) DEFAULT 0,
    CategoryID INT REFERENCES Category(CategoryID) ON DELETE
    SET NULL
);
-- Bảng tư vấn
CREATE TABLE Consulting (
    EmployeeID INT REFERENCES Consultant(EmployeeID) ON DELETE CASCADE,
    CustomerID INT REFERENCES Customer(CustomerID) ON DELETE CASCADE,
    ProductID INT REFERENCES Product(ProductID) ON DELETE
    SET NULL,
        PRIMARY KEY (EmployeeID, CustomerID, ProductID)
);
-- Bảng tài khoản khách hàng
CREATE TABLE MemberAccount (
    AccountID SERIAL PRIMARY KEY,
    CustomerID INT REFERENCES Customer(CustomerID) ON DELETE CASCADE,
    Type VARCHAR(50) NOT NULL,
    Points INT CHECK (Points >= 0) DEFAULT 0,
    StartDate DATE NOT NULL,
    DueDate DATE NOT NULL
);
-- Bảng bảo hành
CREATE TABLE WarrantyCard (
    ProductID INT PRIMARY KEY REFERENCES Product(ProductID) ON DELETE CASCADE,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL
);
-- Bảng đơn vị vận chuyển
CREATE TABLE Delivery (
    DeliveryID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15) NOT NULL UNIQUE
);
-- Bảng đơn hàng
CREATE TABLE OrderTable (
    OrderID SERIAL PRIMARY KEY,
    OrderDate DATE NOT NULL DEFAULT CURRENT_DATE,
    Address TEXT NOT NULL,
    Status StatusEnum DEFAULT 'Pending',
    CustomerID INT REFERENCES Customer(CustomerID) ON DELETE CASCADE,
    DeliveryID INT REFERENCES Delivery(DeliveryID) ON DELETE
    SET NULL
);
-- Bảng chi tiết đơn hàng
CREATE TABLE OrderDetails (
    OrderID INT REFERENCES OrderTable(OrderID) ON DELETE CASCADE,
    ProductID INT REFERENCES Product(ProductID) ON DELETE CASCADE,
    PRIMARY KEY (OrderID, ProductID)
);
-- Bảng phương thức thanh toán
CREATE TABLE PaymentMethod (
    PaymentID SERIAL PRIMARY KEY,
    ModeOfPayment PaymentEnum NOT NULL
);
-- Bảng hóa đơn
CREATE TABLE Invoice (
    InvoiceID SERIAL PRIMARY KEY,
    TotalCost DECIMAL(10, 2) CHECK (TotalCost >= 0) NOT NULL,
    ExportingDate DATE NOT NULL DEFAULT CURRENT_DATE,
    Quantity INT CHECK (Quantity > 0) NOT NULL,
    CustomerID INT REFERENCES Customer(CustomerID) ON DELETE
    SET NULL,
        CounterID INT REFERENCES Checkout(CounterID) ON DELETE
    SET NULL,
        PaymentID INT REFERENCES PaymentMethod(PaymentID) ON DELETE
    SET NULL
);
-- Bảng giảm giá
CREATE TABLE Discount (
    DiscountID SERIAL PRIMARY KEY,
    DiscountLevel DECIMAL(5, 2) CHECK (
        DiscountLevel BETWEEN 0 AND 100
    ) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL
);
-- Bảng áp dụng giảm giá
CREATE TABLE ApplyDiscount (
    InvoiceID INT REFERENCES Invoice(InvoiceID) ON DELETE CASCADE,
    DiscountID INT REFERENCES Discount(DiscountID) ON DELETE CASCADE,
    PRIMARY KEY (InvoiceID, DiscountID)
);
-- Bảng mua hàng online
CREATE TABLE OnlineBuying (
    InvoiceID INT PRIMARY KEY REFERENCES Invoice(InvoiceID) ON DELETE CASCADE,
    OrderID INT REFERENCES OrderTable(OrderID) ON DELETE CASCADE
);
-- Bảng mua hàng trực tiếp
CREATE TABLE OfflineBuying (
    InvoiceID INT REFERENCES Invoice(InvoiceID) ON DELETE CASCADE,
    ProductID INT REFERENCES Product(ProductID) ON DELETE CASCADE,
    PRIMARY KEY (InvoiceID, ProductID)
);