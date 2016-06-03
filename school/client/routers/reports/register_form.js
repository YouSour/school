schoolRoutes.route('/registerFormReportGen', {
    name: 'school.registerFormReportGen',
    action: function (params, queryParams) {
        Layout.report('school_registerFormReportGen');
    }
});
