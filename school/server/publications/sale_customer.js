// SaleCustomer
Meteor.publish('school_saleCustomer', function (id) {
    if (this.userId) {
        id = _.isUndefined(id) ? {} : id;
        return School.Collection.SaleCustomer.find(id);
    }
});
Meteor.publish('school_saleCustomerByBranch', function (branchId) {
    if (this.userId) {
        return School.Collection.SaleCustomer.find({cpanel_branchId: branchId});
    }
});
