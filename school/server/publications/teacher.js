// Teacher
Meteor.publish('school_teacher', function (id) {
    if (this.userId) {
        id = _.isUndefined(id) ? {} : id;
        return School.Collection.Teacher.find(id);
    }
});
Meteor.publish('school_teacherByBranch', function (brnachId) {
    if (this.userId) {
        return School.Collection.Teacher.find({cpanel_branchId: brnachId});
    }
});
