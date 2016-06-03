Meteor.startup(function () {
    if (School.Collection.TransportItem.find().count() == 0) {
        var data = [
            {
                "name": 'Location A',
                "zone": 'U',
                "paymentMethod": [
                    {
                        "term": 1,
                        "single": 10,
                        "twice": 15,
                        "threeTimes": 20,
                        "fourTimes": 30
                    },
                    {
                        "term": 3,
                        "single": 30,
                        "twice": 40,
                        "threeTimes": 50,
                        "fourTimes": 60
                    },
                    {
                        "term": 6,
                        "single": 35,
                        "twice": 45,
                        "threeTimes": 55,
                        "fourTimes": 65
                    }
                ]
            },
            {
                "name": 'Location B',
                "zone": 'S',
                "paymentMethod": [
                    {
                        "term": 1,
                        "single": 15,
                        "twice": 10,
                        "threeTimes": 25,
                        "fourTimes": 35
                    },
                    {
                        "term": 3,
                        "single": 35,
                        "twice": 45,
                        "threeTimes": 55,
                        "fourTimes": 65
                    },
                    {
                        "term": 6,
                        "single": 40,
                        "twice": 50,
                        "threeTimes": 60,
                        "fourTimes": 70
                    }
                ]
            }
        ];

        _.each(data, function (val) {
            var id = idGenerator.gen(School.Collection.TransportItem, 4);
            val._id = id;
            School.Collection.TransportItem.insert(val);
        });
    }
});