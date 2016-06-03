/**
 * Declare template
 */
var formTpl = Template.school_collectionSheetRegisterByStudentReport,
  genTpl = Template.school_collectionSheetRegisterByStudentReportGen;

/**
 * Form
 */
formTpl.onRendered(function() {
  var name = $('[name="date"]');
  DateTimePicker.date(name);
});

formTpl.events({
  'change [name="department"]': function(e, t) {
    var department = $(e.currentTarget).val();
    School.ListStateForReport.set('department', department);
  },
  'change [name="course"]':function(e,t){
    var course = $(e.currentTarget).val();
    School.ListStateForReport.set('course',course);
  },
  'change [name="class"]':function(e,t){
    var classTemp = $(e.currentTarget).val();
    School.ListStateForReport.set('class',classTemp);
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
      paper: 'a5',
      orientation: 'portrait'
    };
  },
  data: function() {
    // Get query params
    //FlowRouter.watchPathChange();
    var q = FlowRouter.current().queryParams;
    Fetcher.setDefault("data", false);
    Fetcher.retrieve('data',
      'school_collectionSheetRegisterByStudentReport', q);

    console.log(Fetcher.get('data').content);

    return Fetcher.get('data');
  },
  getIndex: function(index){
    console.log(index);
    // console.log(index % 4 == 0);
    if(index % 1 == 0){
      return true;
    }else{
      return false;
    }
  }
});
