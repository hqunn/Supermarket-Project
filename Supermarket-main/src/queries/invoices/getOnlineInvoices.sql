SELECT i.*
FROM Invoice i
    JOIN OnlineBuying ob ON i.InvoiceID = ob.InvoiceID;