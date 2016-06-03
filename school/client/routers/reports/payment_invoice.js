schoolRoutes.route('/paymentInvoiceReportGen', {
    name: 'school.paymentInvoiceReportGen',
    action: function (params, queryParams) {
        Layout.report('school_paymentInvoiceReportGen');
    }
});
