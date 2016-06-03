// Transport
Meteor.publish('school_transport', function (id) {
    if (this.userId) {
        id = _.isUndefined(id) ? {} : id;
        return School.Collection.Transport.find(id);
    }
});
Meteor.publish('school_transportByStudent', function (studentId) {
    if (this.userId) {
        return School.Collection.Transport.find({studentId: studentId});
    }
});
