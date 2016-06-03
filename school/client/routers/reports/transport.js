schoolRoutes.route('/transportReport', {
    name: 'school.transportReport',
    subscriptions: function (params, queryParams) {
        this.register('school_transportItem', Meteor.subscribe('school_transportItem'));
        this.register('school_exchange', Meteor.subscribe('school_exchange'));
    },
    action: function (params, queryParams) {
        Layout.main('school_transportReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Transport Report',
        parent: 'school.home'
    }
});

schoolRoutes.route('/transportReportGen', {
    name: 'school.transportReportGen',
    action: function (params, queryParams) {
        Layout.report('school_transportReportGen');
    }
});
