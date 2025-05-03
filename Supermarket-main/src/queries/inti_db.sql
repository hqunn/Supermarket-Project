mywebapp!!!!!
psql -d myuser -d mywebapp
-- Insert Employees
INSERT INTO Employee (Name, PhoneNumber, Role, Salary)
VALUES 
('Alice Johnson', '1112223333', 'Cashier', 3200.00),
('Bob Smith', '2223334444', 'Stocker', 2800.00),
('Carol Davis', '3334445555', 'Cleaner', 2500.00),
('David Wilson', '4445556666', 'Delivery', 3000.00),
('Eve Miller', '5556667777', 'Cashier', 3300.00);

-- Insert Checkouts
INSERT INTO Checkout DEFAULT VALUES; -- id 1
INSERT INTO Checkout DEFAULT VALUES; -- id 2

-- Insert Cashiers
INSERT INTO Cashier (EmployeeID, CounterID)
VALUES 
(1, 1),
(5, 2);

-- Insert Delivery Personnel
INSERT INTO Delivery (EmployeeID, DeliveryArea)
VALUES 
(4, 'Zone A');

-- Insert Customers
INSERT INTO Customer (Name, PhoneNumber, Email, Address)
VALUES 
('John Doe', '9998887777', 'john.doe@email.com', '123 Maple St'),
('Jane Smith', '8887776666', 'jane.smith@email.com', '456 Oak Rd');

-- Insert Discounts
INSERT INTO Discount (Percentage)
VALUES 
(10), -- 10%
(20); -- 20%

-- Insert Invoices
INSERT INTO Invoice (CustomerID, DiscountID, TotalAmount, PurchaseDate)
VALUES 
(1, 1, 100.00, '2025-04-20'),
(2, 2, 200.00, '2025-04-21');

-- Insert Products
INSERT INTO Product (ProductName, ProductType, Stock, Price, ExpiryDate, Supplier, Aisle)
VALUES 
('Milk', 'Dairy', 100, 2.50, '2025-06-01', 'DairyCo', 1),
('Eggs', 'Poultry', 200, 3.00, '2025-05-15', 'FarmFresh', 2),
('Bread', 'Bakery', 150, 2.00, '2025-04-25', 'BakeHouse', 3),
('Apples', 'Fruit', 180, 1.50, '2025-05-10', 'FruitExpress', 4);

-- Insert Product-Invoice Links
INSERT INTO ProductInvoice (ProductID, InvoiceID, Quantity)
VALUES 
(1, 1, 2), -- 2 x Milk on Invoice 1
(2, 1, 1), -- 1 x Eggs on Invoice 1
(3, 2, 3), -- 3 x Bread on Invoice 2
(4, 2, 5); -- 5 x Apples on Invoice 2
