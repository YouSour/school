// Schema
School.Schema.CollectionSheetRegisterReport = new SimpleSchema({
  branch: {
    type: String,
    autoform: {
      type: "select2",
      options: function() {
        return School.ListForReport.branch();
      }
    },
    optional: true
  },
  department: {
    type: String,
    autoform: {
      type: "select2",
      options: function() {
        return School.ListForReport.department();
      }
    },
    optional: true
  },
  course: {
    type: String,
    autoform: {
      type: "select2",
      options: function() {
        return School.ListForReport.courseByDepartment();
      }
    },
    optional: true
  },
  newOld: {
    type: String,
    autoform: {
      type: "select2",
      options: function() {
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
      options: function() {
        return School.ListForReport.registerStatus();
      }
    },
    optional: true
  },
  date: {
    type: String,
    label: 'Date',
    defaultValue: function() {
      var current = moment().format('YYYY-MM-DD');
      return current;
    }
  },
  //viewType: {
  //  type: String,
  //  label: "View Type",
  //  autoform: {
  //    type: "select2",
  //    options: function() {
  //      return School.ListForReport.viewType();
  //    }
  //  }
  //},
  exchange: {
    type: String,
    autoform: {
      type: "select2",
      options: function() {
        return School.List.exchange();
      }
    }
  }
});
