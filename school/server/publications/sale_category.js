// Sale Category
Meteor.publish('school_saleCategory', function (id) {
    if (this.userId) {
        id = _.isUndefined(id) ? {} : id;
        return School.Collection.SaleCategory.find(id);
    }
});
