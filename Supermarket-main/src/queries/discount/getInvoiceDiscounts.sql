SELECT d.*
FROM ApplyDiscount ad
    JOIN Discount d ON ad.DiscountID = d.DiscountID
WHERE ad.InvoiceID = $1;