Meteor.startup(function () {
    if (School.Collection.Student.find().count() == 0) {
        for (var i = 1; i <= 3; i++) {
            var branchId = '001';
            var id = idGenerator.genWithPrefix(School.Collection.Student, branchId + '-', 6);
            var studentName = faker.name.findName();
            var data = {
                "_id": id,
                "khName": studentName + '-KH',
                "enName": studentName,
                "gender": faker.random.arrayElement(['M', 'F']),
                "dob": moment(faker.date.past()).format('YYYY-MM-DD'),
                "pob": faker.random.arrayElement(['Battambang', 'Banteay MeanChey', 'Phnom Pench']),
                "nationality": faker.random.arrayElement(['KHM', 'OTH']),
                "address": faker.random.arrayElement(['Battambang', 'Banteay MeanChey', 'Phnom Pench']),
                "telephone": faker.phone.phoneNumber(),
                "emergency": {
                    "name": faker.name.findName(),
                    "relation": faker.random.arrayElement(['Family', 'Friend']),
                    "contact": faker.phone.phoneNumber()
                },
                "family": {
                    "fatherName": faker.name.findName(),
                    "fatherJob": faker.name.jobType(),
                    "motherName": faker.name.findName(),
                    "motherJob": faker.name.jobType()
                },
                "cpanel_branchId": branchId
            };

            School.Collection.Student.insert(data);
        }
    }
});