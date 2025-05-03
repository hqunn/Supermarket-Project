SELECT e.*
FROM Employee e
    JOIN Cashier c ON e.EmployeeID = c.EmployeeID;