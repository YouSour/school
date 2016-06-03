schoolRoutes.route('/registerStatusReport', {
    name: 'school.registerStatusReport',
    subscriptions: function (params, queryParams) {
        this.register('school_department', Meteor.subscribe('school_department'));
        this.register('school_course', Meteor.subscribe('school_course'));
        this.register('school_exchange', Meteor.subscribe('school_exchange'));
    },
    action: function (params, queryParams) {
        Layout.main('school_registerStatusReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Registration Status Report',
        parent: 'school.home'
    }
});

schoolRoutes.route('/registerStatusReportGen', {
    name: 'school.registerStatusReportGen',
    action: function (params, queryParams) {
        Layout.report('school_registerStatusReportGen');
    }
});
