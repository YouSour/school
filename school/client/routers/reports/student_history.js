schoolRoutes.route('/studentHistoryReport', {
    name: 'school.studentHistoryReport',
    action: function (params, queryParams) {
        Layout.main('school_studentHistoryReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Student History Report',
        parent: 'school.home'
    }
});

schoolRoutes.route('/studentHistoryReportGen', {
    name: 'school.studentHistoryReportGen',
    action: function (params, queryParams) {
        Layout.report('school_studentHistoryReportGen');
    }
});

