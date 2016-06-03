var subs = new SubsManager();
schoolRoutes.route('/register/:studentId', {
    name: 'school.register',
    subscriptions: function (params, queryParams) {
        this.register('school_registerByStudent', Meteor.subscribe('school_registerByStudent', params.studentId));
        this.register('school_studentById', Meteor.subscribe('school_student', params.studentId));
        this.register('school_course', Meteor.subscribe('school_course'));
        this.register('school_classByBranch', Meteor.subscribe('school_classByBranch', Session.get('currentBranch')));
    },
    action: function (params, queryParams) {
        Layout.main('school_register');
    },
    breadcrumb: {
        params: ['studentId'],
        //queryParams: ['show', 'color'],
        title: 'Register',
        parent: 'school.student'
    }
});
