Meteor.startup(function () {
    if (School.Collection.Department.find().count() == 0) {
        // Department
        var depData = [
            {name: "Khmer Primary School", shortName: "KPS"},
            {name: "English Primary School", shortName: "EPS"}
        ];

        _.each(depData, function (depVal) {
            var depId = idGenerator.gen(School.Collection.Department, 3);
            depVal._id = depId;
            School.Collection.Department.insert(depVal);

            // Course
            var courseData = ["Course A", "Course B"];
            _.each(courseData, function (courseVal, courseKey) {
                var term, baseAmount;
                var method = [];

                if (courseKey == 0) {
                    term = 5;
                    baseAmount = 10;
                    method = [
                        {"term": 1, "cost": 10, "discount": 0, "amount": 10},
                        {"term": 3, "cost": 30, "discount": 2, "amount": 28},
                        {"term": 5, "cost": 50, "discount": 5, "amount": 45}
                    ];
                } else if (courseKey == 1) {
                    term = 12;
                    baseAmount = 20;
                    method = [
                        {"term": 1, "cost": 20, "discount": 0, "amount": 20},
                        {"term": 3, "cost": 60, "discount": 2, "amount": 58},
                        {"term": 6, "cost": 120, "discount": 6, "amount": 114},
                        {"term": 12, "cost": 240, "discount": 15, "amount": 225}
                    ];
                }

                var itemId = idGenerator.genWithPrefix(School.Collection.Course, depId, 3);
                School.Collection.Course.insert(
                    {
                        _id: itemId,
                        "name": courseVal + '-' + depVal.shortName,
                        "term": term,
                        "baseAmount": baseAmount,
                        "paymentMethod": method,
                        "status": "E",
                        "des": "",
                        departmentId: depId
                    }
                );
            });
        })
    }
});