// Student
Meteor.publish('school_student', function (id) {
    if (this.userId) {
        id = _.isUndefined(id) ? {} : id;
        return School.Collection.Student.find(id);
    }
});
Meteor.publish('school_studentByBranch', function (branchId) {
    if (this.userId) {
        return School.Collection.Student.find({cpanel_branchId: branchId});
    }
});
