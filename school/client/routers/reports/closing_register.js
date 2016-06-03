schoolRoutes.route('/closingRegisterReport', {
    name: 'school.closingRegisterReport',
    subscriptions: function (params, queryParams) {
        this.register('school_department', Meteor.subscribe('school_department'));
        this.register('school_course', Meteor.subscribe('school_course'));
        this.register('school_exchange', Meteor.subscribe('school_exchange'));
    },
    action: function (params, queryParams) {
        Layout.main('school_closingRegisterReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Closing Registration Report',
        parent: 'school.home'
    }
});

schoolRoutes.route('/closingRegisterReportGen', {
    name: 'school.closingRegisterReportGen',
    action: function (params, queryParams) {
        Layout.report('school_closingRegisterReportGen');
    }
});
