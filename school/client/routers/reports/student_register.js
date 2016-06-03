schoolRoutes.route('/studentRegisterReport', {
    name: 'school.studentRegisterReport',
    subscriptions: function (params, queryParams) {
        this.register('school_department', Meteor.subscribe('school_department'));
        this.register('school_course', Meteor.subscribe('school_course'));
        this.register('school_exchange', Meteor.subscribe('school_exchange'));
    },
    action: function (params, queryParams) {
        Layout.main('school_studentRegisterReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Student Registration Report',
        parent: 'school.home'
    }
});

schoolRoutes.route('/studentRegisterReportGen', {
    name: 'school.studentRegisterReportGen',
    action: function (params, queryParams) {
        Layout.report('school_studentRegisterReportGen');
    }
});
