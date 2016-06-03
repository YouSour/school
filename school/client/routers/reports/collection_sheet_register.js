schoolRoutes.route('/collectionSheetRegisterReport', {
  name: 'school.collectionSheetRegisterReport',
  subscriptions: function(params, queryParams) {
    this.register('school_department', Meteor.subscribe(
      'school_department'));
    this.register('school_course', Meteor.subscribe('school_course'));
    this.register('school_exchange', Meteor.subscribe('school_exchange'));
  },
  action: function(params, queryParams) {
    Layout.main('school_collectionSheetRegisterReport');
  },
  breadcrumb: {
    //params: ['id'],
    //queryParams: ['show', 'color'],
    title: 'Collection Sheet Registration Report',
    parent: 'school.home'
  }
});

schoolRoutes.route('/collectionSheetRegisterReportGen', {
  name: 'school.collectionSheetRegisterReportGen',
  action: function(params, queryParams) {
    //if (queryParams.viewType == "list") {
      Layout.report('school_collectionSheetRegisterReportGen');
    //} else {
    //  Layout.report('school_collectionSheetRegisterInvoiceReportGen');
    //}
  }
});
