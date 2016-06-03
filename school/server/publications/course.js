// Course
Meteor.publish('school_course', function (id) {
    if (this.userId) {
        id = _.isUndefined(id) ? {} : id;
        return School.Collection.Course.find(id);
    }
});
