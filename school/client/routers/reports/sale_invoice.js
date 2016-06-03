schoolRoutes.route('/saleInvoiceReportGen', {
    name: 'school.saleInvoiceReportGen',
    action: function (params, queryParams) {
        Layout.report('school_saleInvoiceReportGen');
    }
});
