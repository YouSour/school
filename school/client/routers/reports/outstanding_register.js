schoolRoutes.route('/outstandingRegisterReport', {
    name: 'school.outstandingRegisterReport',
    subscriptions: function (params, queryParams) {
        this.register('school_department', Meteor.subscribe('school_department'));
        this.register('school_course', Meteor.subscribe('school_course'));
        this.register('school_exchange', Meteor.subscribe('school_exchange'));
    },
    action: function (params, queryParams) {
        Layout.main('school_outstandingRegisterReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Outstanding Registration Report',
        parent: 'school.home'
    }
});

schoolRoutes.route('/outstandingRegisterReportGen', {
    name: 'school.outstandingRegisterReportGen',
    action: function (params, queryParams) {
        Layout.report('school_outstandingRegisterReportGen');
    }
});
