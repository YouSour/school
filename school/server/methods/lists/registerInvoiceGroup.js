Meteor.methods({
  school_studyPaymentList: function(studentId) {
    var list = [];

    School.Collection.Payment.find({
      '_register.studentId': studentId
    }, {
      sort: {
        paymentDate: -1
      }
    }).forEach(function(obj) {
      list.push({
        label: "Class: " + obj._register._class.name +
          ' | ' +
          "Paid Date: " + moment(obj.paymentDate)
          .format('YYYY-MM-DD') + ' | Paid Amount: ' + obj.paidAmount,
        value: obj._id
      });
    });
    return list;
  }
});
