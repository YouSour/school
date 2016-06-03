
schoolRoutes.route('/groupBySaleItemReport', {
    name: 'school.groupBySaleItemReport',
    subscriptions: function (params, queryParams) {
        this.register('school_saleCategory', Meteor.subscribe('school_saleCategory'));
        this.register('school_exchange', Meteor.subscribe('school_exchange'));
    },
    action: function (params, queryParams) {
        Layout.main('school_groupBySaleItemReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Group By Sale Item Report',
        parent: 'school.home'
    }
});

schoolRoutes.route('/groupBySaleItemReportGen', {
    name: 'school.groupBySaleItemReportGen',
    action: function (params, queryParams) {
        Layout.report('school_groupBySaleItemReportGen');
    }
});
