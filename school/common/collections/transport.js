// Collection
School.Collection.Transport = new Mongo.Collection("school_transport");

// Schema
School.Schema.Transport = new SimpleSchema({
  studentId: {
    type: String
  },
  staffId: {
    type: String,
    label: "Staff",
    autoform: {
      type: "select2",
      options: function() {
        return School.List.staff();
      }
    }
  },
  transportDate: {
    type: Date,
    defaultValue: function() {
      return moment().format('YYYY-MM-DD');
    }
  },
  itemId: {
    type: String,
    label: "Item",
    autoform: {
      type: "select",
      options: function() {
        return School.ListForSale.transportItem();
      }
    }
  },
  term: {
    type: Number,
    label: "Term (Months)",
    autoform: {
      type: "select",
      options: function() {
        return School.ListForSale.transportTerm();
      }
    }
  },
  fromDate: {
    type: Date
  },
  toDate: {
    type: Date
  },
  service: {
    type: String,
    label: "Service",
    autoform: {
      type: "select",
      options: function() {
        return School.ListForSale.transportService();
      }
    }
  },
  walveAmount: {
    type: Number,
    optional: true,
    decimal: true,
    min: 0.01,
    label: "Walve Amount"
  },
  totalAmount: {
    type: Number,
    decimal: true,
    min: 0.01
  },
  voucherId: {
    type: String,
    label: "Voucher",
    custom: function() {
      var data = School.Collection.Transport.find({
        name: this.value,
        cpanel_branchId: this.field('cpanel_branchId').value
      });
      if (data.count() > 0) {
        return "uniqueVoucher";
      }
    }
  },
  exchangeId: {
    type: String,
    autoform: {
      type: "select2",
      options: function() {
        return School.List.exchange();
      }
    }
  },
  cpanel_branchId: {
    type: String
  }
});

// Attach schema
School.Collection.Transport.attachSchema(School.Schema.Transport);

// Custom message
SimpleSchema.messages({
  //"fromDateGt": "[label] must be greater then from date.",
  "uniqueVoucher": "[label] must be unique."
});
