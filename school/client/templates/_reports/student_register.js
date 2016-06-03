/**
 * Declare template
 */
var formTpl = Template.school_studentRegisterReport,
    genTpl = Template.school_studentRegisterReportGen;

/**
 * Form
 */
formTpl.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.dateRange(name);
});

formTpl.events({
    'change [name="department"]': function (e, t) {
        var department = $(e.currentTarget).val();
        School.ListStateForReport.set('department', department);
    }
});

/**
 * Generate
 */
genTpl.helpers({
    options: function () {
        // font size = null (default), bg
        // paper = a4, a5, mini
        // orientation = portrait, landscape
        return {
            //fontSize: 'bg',
            paper: 'a4',
            orientation: 'landscape'
        };
    },
    data: function () {
        // Get query params
        //FlowRouter.watchPathChange();
        var q = FlowRouter.current().queryParams;
        Fetcher.setDefault("data", false);
        Fetcher.retrieve('data', 'school_studentRegisterReport', q);

        return Fetcher.get('data');
    }
});
