/**
 * Declare template
 */
var formTpl = Template.school_studentHistoryReport,
    genTpl = Template.school_studentHistoryReportGen;

/**
 * Form
 */
formTpl.onCreated(function () {
    this.studentId = new ReactiveVar();
});

formTpl.helpers({
    studentOpt: function () {
        Fetcher.setDefault("student", [{label: '(Select One)', value: ''}]);
        Fetcher.retrieve('student', 'school_studentList', Session.get('currentBranch'));

        return Fetcher.get('student');
    },
    registerOpt: function () {
        var instance = Template.instance(),
            studentId = instance.studentId.get();
        Fetcher.setDefault("register", [{label: '(All)', value: ''}]);
        Fetcher.retrieve('register', 'school_registerByStudentList', studentId);

        return Fetcher.get('register');
    }
});

formTpl.events({
    'change [name="student"]': function (e, t) {
        var student = $(e.currentTarget).val();
        t.studentId.set(student);
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
            orientation: 'portrait'
        };
    },
    data: function () {
        // Get query params
        //FlowRouter.watchPathChange();
        var q = FlowRouter.current().queryParams;
        Fetcher.setDefault("data", false);
        Fetcher.retrieve('data', 'school_studentHistoryReport', q);

        return Fetcher.get('data');
    }
});
