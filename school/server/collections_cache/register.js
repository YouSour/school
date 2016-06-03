// Count
School.Collection.Register.cacheCount(
    'paymentCount',
    School.Collection.Payment,
    'registerId'
);
School.Collection.Register.cacheCount(
    'statusCount',
    School.Collection.RegisterStatus,
    'registerId'
);

// Doc
School.Collection.Register.cacheDoc(
    'student',
    School.Collection.Student,
    ['khName', 'enName', 'gender', 'dob', 'pob', 'nationality', 'address', 'telephone', 'emergency', 'behavior', 'health', 'family', 'transform', 'request', 'photo']
);
School.Collection.Register.cacheDoc(
    'class',
    School.Collection.Class,
    ['name', 'startDate', 'endDate', 'teacherId', '_teacher', 'roomId', '_room', 'dayOfWeek', 'group', 'time', 'status', 'statusDate', '_course']
);

// Doc Back
School.Collection.Register.cacheDocBack(
    'paymentBack',
    School.Collection.Payment,
    ['paymentDate', 'paymentMethod', 'sumOfPaid', 'dueAmount', 'discountAmount', 'totalAmount', 'paidAmount', 'owedAmount', 'outstandingAmount', 'status', 'fromDate', 'toDate'],
    'registerId'
);
School.Collection.Register.cacheDocBack(
    'statusBack',
    School.Collection.RegisterStatus,
    ['statusDate', 'status', 'des'],
    'registerId'
);
