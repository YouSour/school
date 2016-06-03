/**
 * Collection Cache
 */
// Doc
School.Collection.Sale.cacheDoc(
    'customer',
    School.Collection.SaleCustomer,
    ['name', 'gender', 'address', 'telephone', 'description']
);
School.Collection.Sale.cacheDoc(
    'staff',
    School.Collection.Staff,
    ['name', 'gender', 'position', 'telephone']
);
//School.Collection.Sale.cacheDoc(
//    'exchange',
//    Cpanel.Collection.Exchange,
//    ['exDate', 'base', 'rates']
//);
// Compact
School.Collection.Sale.cacheCompactArrayField(['items']);