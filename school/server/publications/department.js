// Department
Meteor.publish('school_department', function (id) {
    if (this.userId) {
        id = _.isUndefined(id) ? {} : id;
        return School.Collection.Department.find(id);
    }
});
