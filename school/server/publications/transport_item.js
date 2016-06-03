// Transport Item
Meteor.publish('school_transportItem', function () {
    if (this.userId) {
        return School.Collection.TransportItem.find();
    }
});
