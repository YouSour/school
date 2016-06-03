var subs = new SubsManager();
schoolRoutes.route('/room', {
    name: 'school.room',
    subscriptions: function (params, queryParams) {
        this.register('school_roomByBranch', Meteor.subscribe('school_roomByBranch', Session.get('currentBranch')));
    },
    action: function (params, queryParams) {
        Layout.main('school_room');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Room',
        parent: 'school.home'
    }
});
