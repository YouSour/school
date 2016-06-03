Meteor.methods({
    school_studentList: function (branchId) {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        School.Collection.Student.find({cpanel_branchId: branchId})
            .forEach(function (obj) {
                list.push({
                    label: obj._id + ' | ' + obj.khName,
                    value: obj._id
                })
            });
        return list;
    }
});