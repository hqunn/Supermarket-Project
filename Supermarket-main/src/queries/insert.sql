-- Insert data for Employee
INSERT INTO Employee (Name, PhoneNumber, Role, Salary)
VALUES ('John Doe', '1234567890', 'Cashier', 3000.00),
    (
        'Alice Smith',
        '0987654321',
        'Consultant',
        3500.00
    );
-- Insert data for Checkout
INSERT INTO Checkout DEFAULT
VALUES;
INSERT INTO Checkout DEFAULT
VALUES;
-- Insert data for Cashier
INSERT INTO Cashier (EmployeeID, CounterID)
VALUES (1, 1);
-- Insert data for Consultant
INSERT INTO Consultant (EmployeeID)
VALUES (2);
-- Insert data for Customer
INSERT INTO Customer (Name, PhoneNumber, Email, Address)
VALUES (
        'Michael Johnson',
        '1112223333',
        'michael@example.com',
        '123 Main St'
    ),
    (
        'Emma Brown',
        '4445556666',
        'emma@example.com',
        '456 Elm St'
    );
-- Insert data for Warehouse
INSERT INTO Warehouse (Name)
VALUES ('Main Warehouse');
-- Insert data for Category
INSERT INTO Category (WarehouseID, Name, CategoryType)
VALUES (1, 'Electronics', 'E'),
    (1, 'Clothing', 'C');
-- Insert data for Product
INSERT INTO Product (Name, Price, Remaining, CategoryID)
VALUES ('Laptop', 1000.00, 50, 1),
    ('T-Shirt', 20.00, 200, 2);
-- Insert data for Consulting
INSERT INTO Consulting (EmployeeID, CustomerID, ProductID)
VALUES (2, 1, 1);
-- Insert data for MemberAccount
INSERT INTO MemberAccount (CustomerID, Type, Points, StartDate, DueDate)
VALUES (1, 'Gold', 500, '2024-01-01', '2025-01-01');
-- Insert data for WarrantyCard
INSERT INTO WarrantyCard (ProductID, StartDate, EndDate)
VALUES (1, '2024-01-01', '2026-01-01');
-- Insert data for Delivery
INSERT INTO Delivery (Name, PhoneNumber)
VALUES ('Fast Delivery', '7778889999');
-- Insert data for OrderTable
INSERT INTO OrderTable (
        OrderDate,
        Address,
        Status,
        CustomerID,
        DeliveryID
    )
VALUES ('2024-07-01', '123 Main St', 'Pending', 1, 1),
;
-- Insert data for OrderDetails
INSERT INTO OrderDetails (OrderID, ProductID)
VALUES (1, 1);
-- Insert data for PaymentMethod
INSERT INTO PaymentMethod (ModeOfPayment)
VALUES ('Credit Card');
-- Insert data for Invoice
INSERT INTO Invoice (
        TotalCost,
        ExportingDate,
        Quantity,
        CustomerID,
        CounterID,
        PaymentID
    )
VALUES (1000.00, '2024-07-02', 1, 1, 1, 1),
    (20.00, '2024-11-03', 1, 2, 1, 1);
-- Insert data for Discount
INSERT INTO Discount (DiscountLevel, StartDate, EndDate)
VALUES (10.00, '2024-07-01', '2024-07-31');
-- Insert data for ApplyDiscount
INSERT INTO ApplyDiscount (InvoiceID, DiscountID)
VALUES (1, 1);
-- Insert data for OnlineBuying
INSERT INTO OnlineBuying (InvoiceID, OrderID)
VALUES (1, 1);
-- Insert data for OfflineBuying
INSERT INTO OfflineBuying (InvoiceID, ProductID)
VALUES (1, 1);
INSERT INTO invoice(
        InvoiceID,
        TotalCost,
        ExportingDate,
        Quantity,
        CustomerID,
        CounterID,
        PaymentID
    )
VALUES (2, 20.00, '2024-11-03', 1, 2, 1, 1);
INSERT INTO offlinebuying(InvoiceID, ProductID)
VALUES (2, 2);
INSERT INTO customer(
        Name,
        PhoneNumber,
        Email,
        Address
    )
VALUES (
        'David Johnson',
        '45464565',
        'SDSDSDSD@gmail.com',
        '123 Main St'
    );