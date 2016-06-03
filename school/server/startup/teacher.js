Meteor.startup(function () {
    if (School.Collection.Teacher.find().count() == 0) {
        for (var i = 1; i <= 3; i++) {
            var branchId = '001';
            var id = idGenerator.genWithPrefix(School.Collection.Teacher, branchId + '-', 4);
            var data = {
                "_id": id,
                "name": faker.name.findName(),
                "gender": faker.random.arrayElement(['M', 'F']),
                "dob": moment(faker.date.past()).format('YYYY-MM-DD'),
                "maritalStatus": faker.random.arrayElement(['Single', 'Married', 'Divorced', 'Unknown']),
                "address": faker.random.arrayElement(['Battambang', 'Banteay MeanChey', 'Phnom Pench']),
                "telephone": faker.phone.phoneNumber(),
                "cpanel_branchId": branchId
            };

            School.Collection.Teacher.insert(data);
        }
    }
});