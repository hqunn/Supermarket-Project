SELECT i.*
FROM Invoice i
    JOIN OfflineBuying ob ON i.InvoiceID = ob.InvoiceID;