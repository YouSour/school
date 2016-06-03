schoolRoutes.route('/paymentReport', {
    name: 'school.paymentReport',
    subscriptions: function (params, queryParams) {
        this.register('school_department', Meteor.subscribe('school_department'));
        this.register('school_course', Meteor.subscribe('school_course'));
        this.register('school_exchange', Meteor.subscribe('school_exchange'));
        this.register('school_staff', Meteor.subscribe('school_staff'));
    },
    action: function (params, queryParams) {
        Layout.main('school_paymentReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Payment Report',
        parent: 'school.home'
    }
});

schoolRoutes.route('/paymentReportGen', {
    name: 'school.paymentReportGen',
    action: function (params, queryParams) {
        Layout.report('school_paymentReportGen');
    }
});
