// Schema
School.Schema.PaymentReport = new SimpleSchema({
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
  date: {
    type: String,
    defaultValue: function() {
      var start = moment().startOf('month').format('YYYY-MM-DD');
      var current = moment().format('YYYY-MM-DD');
      return start + ' To ' + current;
    }
  },
  type: {
    type: String,
    autoform: {
      type: "select2",
      options: function() {
        return School.ListForReport.type();
      }
    },
    optional: true
  },
  staff: {
    type: String,
    autoform: {
      type: "select2",
      options: function() {
        return School.ListForReport.staff();
      }
    },
    optional: true
  },
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
