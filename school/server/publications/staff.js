// Staff
Meteor.publish('school_staff', function (id) {
    if (this.userId) {
        id = _.isUndefined(id) ? {} : id;
        return School.Collection.Staff.find(id);
    }
});
Meteor.publish('school_staffByBranch', function (branchId) {
    if (this.userId) {
        return School.Collection.Staff.find({cpanel_branchId: branchId});
    }
});
