// Room
Meteor.publish('school_room', function (id) {
    if (this.userId) {
        id = _.isUndefined(id) ? {} : id;
        return School.Collection.Room.find(id);
    }
});
Meteor.publish('school_roomByBranch', function (branchId) {
    if (this.userId) {
        return School.Collection.Room.find({cpanel_branchId: branchId});
    }
});
