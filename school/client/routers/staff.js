var subs = new SubsManager();
schoolRoutes.route('/staff', {
    name: 'school.staff',
    subscriptions: function (params, queryParams) {
        this.register('school_staffByBranch', Meteor.subscribe('school_staffByBranch', Session.get('currentBranch')));
    },
    action: function (params, queryParams) {
        Layout.main('school_staff');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Staff',
        parent: 'school.home'
    }
});
