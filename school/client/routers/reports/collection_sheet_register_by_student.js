schoolRoutes.route('/collectionSheetRegisterByStudentReport', {
  name: 'school.collectionSheetRegisterByStudentReport',
  subscriptions: function(params, queryParams) {
    this.register('school_department', Meteor.subscribe(
      'school_department'));
    this.register('school_course', Meteor.subscribe('school_course'));
    this.register('school_class', Meteor.subscribe('school_class'));
    this.register('school_register', Meteor.subscribe('school_register'));
    this.register('school_exchange', Meteor.subscribe('school_exchange'));
  },
  action: function(params, queryParams) {
    Layout.main('school_collectionSheetRegisterByStudentReport');
  },
  breadcrumb: {
    //params: ['id'],
    //queryParams: ['show', 'color'],
    title: 'Collection Sheet Registration By Student Report',
    parent: 'school.home'
  }
});

schoolRoutes.route('/collectionSheetRegisterByStudentReportGen', {
  name: 'school.collectionSheetRegisterByStudentReportGen',
  action: function(params, queryParams) {
    Layout.report('school_collectionSheetRegisterByStudentReportGen');
  }
});
