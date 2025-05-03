SELECT o.*
FROM OrderTable o
WHERE o.CustomerID = $1;