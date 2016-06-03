//Register
Meteor.publish('school_register', function (id) {
    if (this.userId) {
        id = _.isUndefined(id) ? {} : id;
        return School.Collection.Register.find(id);
    }
});
Meteor.publish('school_registerByStudent', function (studentId) {
    if (this.userId) {
        return School.Collection.Register.find({studentId: studentId});
    }
});
