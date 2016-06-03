schoolRoutes.route('/invoiceGroupReport', {
  name: 'school.invoiceGroupReport',
  action: function(params, queryParams) {
    Layout.main('school_invoiceGroupReport');
  },
  subscriptions: function(params, queryParams) {
    this.register('school_payment', Meteor.subscribe(
      'school_payment'));
    this.register('school_exchange', Meteor.subscribe('school_exchange'));
  },
  breadcrumb: {
    //params: ['id'],
    //queryParams: ['show', 'color'],
    title: 'Invoice Group Report',
    parent: 'school.home'
  }
});

schoolRoutes.route('/invoiceGroupReportGen', {
  name: 'school.invoiceGroupReportGen',
  action: function(params, queryParams) {
    Layout.report('school_invoiceGroupReportGen');
  },
  subscriptions: function(params, queryParams) {
    this.register('school_payment', Meteor.subscribe(
      'school_payment'));
    this.register('school_exchange', Meteor.subscribe('school_exchange'));
  }
});
