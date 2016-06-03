Meteor.startup(function () {
    if (School.Collection.Room.find().count() == 0) {
        var roomData = ['Room A', 'Room B', 'Room C'];
        _.each(roomData, function (roomVal) {
            var branchId = '001';
            var id = idGenerator.genWithPrefix(School.Collection.Room, branchId + '-', 3);

            School.Collection.Room.insert({
                _id: id,
                name: roomVal,
                number: faker.random.arrayElement([20, 25, 30]),
                cpanel_branchId: branchId
            });
        });
    }
});