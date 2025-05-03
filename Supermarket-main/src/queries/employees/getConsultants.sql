SELECT e.*
FROM Employee e
    JOIN Consultant con ON e.EmployeeID = con.EmployeeID;