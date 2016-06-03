var subs = new SubsManager();
schoolRoutes.route('/department', {
    name: 'school.department',
    subscriptions: function (params, queryParams) {
        this.register('school_department', Meteor.subscribe('school_department'));
    },
    action: function (params, queryParams) {
        Layout.main('school_department');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Department',
        parent: 'school.home'
    }
});
