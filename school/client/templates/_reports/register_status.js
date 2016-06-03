/**
 * Declare template
 */
var formTpl = Template.school_registerStatusReport,
    genTpl = Template.school_registerStatusReportGen;

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
        Fetcher.retrieve('data', 'school_registerStatusReport', q);

        return Fetcher.get('data');
    }
});
