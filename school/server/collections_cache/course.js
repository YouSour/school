/**
 * Collection Cache
 */
// Count
School.Collection.Course.cacheCount(
    'classCount',
    School.Collection.Class,
    'courseId'
);
// Doc
School.Collection.Course.cacheDoc(
    'department',
    School.Collection.Department,
    ['name', 'shortName']
);
// Compact
School.Collection.Course.cacheCompactArrayField(['paymentMethod']);
