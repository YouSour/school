schoolRoutes.route('/transportInvoiceReportGen', {
    name: 'school.transportInvoiceReportGen',
    action: function (params, queryParams) {
        Layout.report('school_transportInvoiceReportGen');
    }
});
