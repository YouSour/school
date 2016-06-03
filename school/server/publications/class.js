// Class
Meteor.publish('school_class', function (id) {
    if (this.userId) {
        id = _.isUndefined(id) ? {} : id;
        return School.Collection.Class.find(id);
    }
});
Meteor.publish('school_classByBranch', function (branchId) {
    if (this.userId) {
        return School.Collection.Class.find({cpanel_branchId: branchId});
    }
});
