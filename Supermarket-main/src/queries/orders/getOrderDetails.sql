SELECT o.*,
    p.Name AS ProductName,
    p.Price
FROM OrderDetails o
    JOIN Product p ON o.ProductID = p.ProductID
WHERE o.OrderID = $1;