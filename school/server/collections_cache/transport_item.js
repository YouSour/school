/**
 * Collection Cache
 */
// Count
School.Collection.TransportItem.cacheCount(
    'transportCount',
    School.Collection.Transport,
    'itemId'
);
// Compact
School.Collection.TransportItem.cacheCompactArrayField(['paymentMethod']);