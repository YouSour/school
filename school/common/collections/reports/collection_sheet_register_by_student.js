// Schema
School.Schema.CollectionSheetRegisterByStudentReport = new SimpleSchema({
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
            //,
            //afFieldInput:{
            //  select2Options:{
            //    theme:"bootstrap"
            //  }
            //}
        },
        optional: true
    },
    class: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.ListForReport.classByDepartment();
            }
        },
        optional: true
    },
    register: {
        type: String,
        label: 'Register',
        autoform: {
            type: 'select2',
            options: function () {
                return School.ListForReport.registerByDepartment();
            }
        },
        optional: true
    },
    status: {
      type: String,
      label: 'Register status',
      autoform: {
        type: "select2",
        options: function() {
          return School.ListForReport.registerStatus();
        }
      },
      optional: true
    },
    date: {
        type: String,
        label: 'Date',
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
