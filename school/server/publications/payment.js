// Payment
Meteor.publish('school_payment', function (id) {
    if (this.userId) {
        id = _.isUndefined(id) ? {} : id;
        return School.Collection.Payment.find(id);
    }
});
Meteor.publish('school_paymentByRegister', function (registerId) {
    if (this.userId) {
        return School.Collection.Payment.find({registerId: registerId});
    }
});
