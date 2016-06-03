Meteor.methods({
    school_registerByStudentList: function (studentId) {
        var list = [];
        list.push({label: "(All)", value: ""});

        School.Collection.Register.find({studentId: studentId})
            .forEach(function (obj) {
                list.push({
                    label: obj._id + ' | ' + moment(obj.registerDate).format('YYYY-MM-DD') + ' | Course: ' + obj._class._course.name + ' | Dep:' + obj._class._course._department.shortName,
                    value: obj._id
                })
            });
        return list;
    }
});