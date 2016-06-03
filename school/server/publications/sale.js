// Sale
Meteor.publish('school_sale', function (id) {
    if (this.userId) {
        id = _.isUndefined(id) ? {} : id;
        return School.Collection.Sale.find(id);
    }
});
Meteor.publish('school_saleByCustomer', function (customerId) {
    if (this.userId) {
        return School.Collection.Sale.find({customerId: customerId});
    }
});
