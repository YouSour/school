School.Collection.Transport.cacheDoc(
    'student',
    School.Collection.Student,
    ['khName', 'enName', 'gender', 'dob', 'pod', 'nationality', 'address', 'telephone', 'emergency', 'behavior', 'health', 'family', 'transform', 'request', 'photo']
);
School.Collection.Transport.cacheDoc(
    'staff',
    School.Collection.Staff,
    ['name', 'gender', 'position', 'telephone']
);
School.Collection.Transport.cacheDoc(
    'item',
    School.Collection.TransportItem,
    ['name', 'zone']
);
//School.Collection.Transport.cacheDoc(
//    'exchange',
//    Cpanel.Collection.Exchange,
//    ['exDate', 'base', 'rates']
//);
