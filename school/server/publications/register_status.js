// Register Status
Meteor.publish('school_registerStatus', function (id) {
    if (this.userId) {
        id = _.isUndefined(id) ? {} : id;
        return School.Collection.RegisterStatus.find(id);
    }
});
Meteor.publish('school_registerStatusByRegister', function (registerId) {
    if (this.userId) {
        return School.Collection.RegisterStatus.find({registerId: registerId});
    }
});
