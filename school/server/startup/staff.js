Meteor.startup(function () {
    if (School.Collection.Staff.find().count() == 0) {
        for (var i = 1; i <= 3; i++) {
            var branchId = '001';
            var id = idGenerator.genWithPrefix(School.Collection.Staff, branchId + '-', 4);
            var data = {
                "_id": id,
                "name": faker.name.findName(),
                "gender": faker.random.arrayElement(['M', 'F']),
                "dob": moment(faker.date.past()).format('YYYY-MM-DD'),
                "maritalStatus": faker.random.arrayElement(['Single', 'Married', 'Divorced', 'Unknown']),
                "position": faker.random.arrayElement(['Cashier', 'Accountant', 'Admin', 'Manager']),
                "address": faker.random.arrayElement(['Battambang', 'Banteay MeanChey', 'Phnom Pench']),
                "telephone": faker.phone.phoneNumber(),
                "cpanel_branchId": branchId
            };

            School.Collection.Staff.insert(data);
        }
    }
});