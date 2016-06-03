// Schema
School.Schema.InvoiceGroupReport = new SimpleSchema({
  student: {
    type: String
  },
  studyPayment: {
    type: [String],
    optional: true
  },
  transport: {
    type: [String],
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
