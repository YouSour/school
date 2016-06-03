/**
 * Declare template
 */
var formTpl = Template.school_invoiceGroupReport,
  genTpl = Template.school_invoiceGroupReportGen;

/**
 * Form
 */
formTpl.onCreated(function() {
  this.studentId = new ReactiveVar();
});

formTpl.helpers({
  studentOpt: function() {
    Fetcher.setDefault("student", [{
      label: '(Select One)',
      value: ''
    }]);
    Fetcher.retrieve('student', 'school_studentList', Session.get(
      'currentBranch'));

    return Fetcher.get('student');
  },
  studyPaymentOpt: function() {
    var instance = Template.instance(),
      studentId = instance.studentId.get();

    Fetcher.retrieve('studyPayment',
      'school_studyPaymentList',
      studentId);

    return Fetcher.get('studyPayment');
  },
  transportOpt: function() {
    var instance = Template.instance(),
      studentId = instance.studentId.get();

    Fetcher.retrieve('transport', 'school_transpotByStudentList',
      studentId);

    return Fetcher.get('transport');
  }

});

formTpl.events({
  'change [name="student"]': function(e, t) {
    var student = $(e.currentTarget).val();
    t.studentId.set(student);
  }
});

/**
 * Generate
 */
genTpl.helpers({
  options: function() {
    // font size = null (default), bg
    // paper = a4, a5, mini
    // orientation = portrait, landscape
    return {
      fontSize: 'bg',
      paper: 'a4',
      orientation: 'portrait'
    };
  },
  data: function() {
    // Get query params
    //FlowRouter.watchPathChange();
    var q = FlowRouter.current().queryParams;
    Fetcher.setDefault("data", false);
    Fetcher.retrieve('data', 'school_invoiceGroupReport', q);

    return Fetcher.get('data');
  }
});
