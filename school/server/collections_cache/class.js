// Register count
School.Collection.Class.cacheCount(
    'registerCount',
    School.Collection.Register,
    'classId'
);
// Course cache
School.Collection.Class.cacheDoc(
    'course',
    School.Collection.Course,
    ['name', 'term', 'baseAmount', 'paymentMethod', 'departmentId', '_department']
);
// Teacher cache
School.Collection.Class.cacheDoc(
    'teacher',
    School.Collection.Teacher,
    ['name', 'gender', 'telephone']
);
// Room cache
School.Collection.Class.cacheDoc(
    'room',
    School.Collection.Room,
    ['name', 'number']
);
