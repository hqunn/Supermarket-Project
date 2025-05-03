--insert product 
INSERT INTO Product (
        Name,
        Price,
        Remaining,
        CategoryID
    )
VALUES ($1, $2, $3, $4, $5, $6)