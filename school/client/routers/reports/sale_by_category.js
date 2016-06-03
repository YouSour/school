schoolRoutes.route('/saleByCategoryReport', {
    name: 'school.saleByCategoryReport',
    subscriptions: function (params, queryParams) {
        this.register('school_saleCategory', Meteor.subscribe('school_saleCategory'));
        this.register('school_exchange', Meteor.subscribe('school_exchange'));
    },
    action: function (params, queryParams) {
        Layout.main('school_saleByCategoryReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Sale By Category Report',
        parent: 'school.home'
    }
});

schoolRoutes.route('/saleByCategoryReportGen', {
    name: 'school.saleByCategoryReportGen',
    action: function (params, queryParams) {
        Layout.report('school_saleByCategoryReportGen');
    }
});
