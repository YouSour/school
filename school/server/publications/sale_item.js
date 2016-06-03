// Sale Item
Meteor.publish('school_saleItem', function (id) {
    if (this.userId) {
        id = _.isUndefined(id) ? {} : id;
        return School.Collection.SaleItem.find(id);
    }
});
