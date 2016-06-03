var subs = new SubsManager();
schoolRoutes.route('/teacher', {
    name: 'school.teacher',
    subscriptions: function (params, queryParams) {
        this.register('school_teacherByBranch', Meteor.subscribe('school_teacherByBranch', Session.get('currentBranch')));
    },
    action: function (params, queryParams) {
        Layout.main('school_teacher');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Teacher',
        parent: 'school.home'
    }
});
