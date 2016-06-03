// Collection
School.Collection.Payment = new Mongo.Collection("school_payment");

// Schema
School.Schema.Payment = new SimpleSchema({
  registerId: {
    type: String
  },
  staffId: {
    type: String,
    autoform: {
      type: "select2",
      options: function() {
        return School.List.staff();
      }
    }
  },
  paymentDate: {
    type: Date,
    defaultValue: function() {
      return moment().format('YYYY-MM-DD HH:mm:ss');
    }
  },
  paymentMethod: {
    type: String,
    autoform: {
      type: "select2",
      options: function() {
        return School.List.paymentMethodForPayment();
      }
    }
  },
  status: {
    type: String,
    max: 100
  },
  sumOfPaid: {
    type: Number,
    decimal: true
  },
  dueAmount: {
    type: Number,
    decimal: true,
    min: 0.01
  },
  discountAmount: {
    type: Number,
    decimal: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    decimal: true,
    min: 0
  },
  paidAmount: {
    type: Number,
    decimal: true,
    min: 0,
    custom: function() {
      if (this.value > this.field('totalAmount').value) {
        return 'paidAmountLte';
      }
    }
  },
  owedAmount: {
    type: Number,
    decimal: true,
    min: 0
  },
  outstandingAmount: {
    type: Number,
    decimal: true,
    min: 0
  },
  fromDate: {
    type: Date
  },
  toDate: {
    type: Date
  },
  voucherId: {
    type: String,
    unique: true
      //custom: function () {
      //    var data = School.Collection.Payment.find({
      //        voucherId: this.value,
      //        cpanel_branchId: this.field('cpanel_branchId').value
      //    });
      //    if (data.count() > 0) {
      //        return "uniqueVoucher";
      //    }
      //}
  },
  type: {
    type: String,
    autoform: {
      type: "select2",
      options: function() {
        return School.List.type();
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
School.Collection.Payment.attachSchema(School.Schema.Payment);

// Custom message
SimpleSchema.messages({
  "paymentDateGteLast": "[label] must be granter than or equal to last payment.",
  "paidAmountLte": "[label] must be less than or equal to due amount.",
  "expiryDateGt": "[label] must be greater then issue date."
    //"uniqueVoucher": "[label] must be unique."
});
