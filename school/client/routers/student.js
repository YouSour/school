var subs = new SubsManager();
schoolRoutes.route('/student', {
    name: 'school.student',
    subscriptions: function (params, queryParams) {
        this.register('school_studentByBranch', Meteor.subscribe('school_studentByBranch', Session.get('currentBranch')));
    },
    action: function (params, queryParams) {
        Layout.main('school_student');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Student',
        parent: 'school.home'
    }
});
