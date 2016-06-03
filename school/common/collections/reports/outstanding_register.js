// Schema
School.Schema.OutstandingRegisterReport = new SimpleSchema({
    branch: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.ListForReport.branch();
            }
        },
        optional: true
    },
    department: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.ListForReport.department();
            }
        },
        optional: true
    },
    course: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.ListForReport.courseByDepartment();
            }
        },
        optional: true
    },
    newOld: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.ListForReport.newOld();
            }
        },
        optional: true
    },
    status: {
        type: String,
        label: 'Register status',
        autoform: {
            type: "select2",
            options: function () {
                return School.ListForReport.registerStatus();
            }
        },
        optional: true
    },
    osAmount: {
        type: String,
        label: 'OS Amount',
        autoform: {
            type: "select2",
            options: function () {
                return School.ListForReport.osAmount();
            }
        },
        optional: true
    },
    date: {
        type: String,
        defaultValue: function () {
            var current = moment().format('YYYY-MM-DD');
            return current;
        }
    },
    exchange: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.List.exchange();
            }
        }
    }
});