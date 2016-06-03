schoolRoutes.route('/saleReport', {
    name: 'school.saleReport',
    subscriptions: function (params, queryParams) {
        this.register('school_saleCategory', Meteor.subscribe('school_saleCategory'));
        this.register('school_exchange', Meteor.subscribe('school_exchange'));
    },
    action: function (params, queryParams) {
        Layout.main('school_saleReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Sale Report',
        parent: 'school.home'
    }
});

schoolRoutes.route('/saleReportGen', {
    name: 'school.saleReportGen',
    action: function (params, queryParams) {
        Layout.report('school_saleReportGen');
    }
});
