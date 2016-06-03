// Class
Meteor.publish('school_exchange', function (id) {
    if (this.userId) {
        id = _.isUndefined(id) ? {} : id;
        return Cpanel.Collection.Exchange.find(id);
    }
});
Meteor.publish('school_exchangeLast', function () {
    if (this.userId) {
        return Cpanel.Collection.Exchange.find({}, {sort: {exDate: -1}, limit: 1});
    }
});
