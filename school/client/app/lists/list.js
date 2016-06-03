// List
School.ListState = new ReactiveObj();

School.List = {
  currency: function() {
    var list = [];
    Cpanel.Collection.Currency.find()
      .forEach(function(obj) {
        list.push({
          label: obj._id + ' (' + obj.symbol + ')',
          value: obj._id
        });
      });
    return list;
  },
  exchange: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });

    Cpanel.Collection.Exchange.find({}, {
        sort: {
          exDate: -1
        }
      })
      .forEach(function(obj) {
        var label = moment(obj.exDate).format('YYYY-MM-DD') +
          ' | Rates: ' + numeral(obj.rates.USD).format('0,0.00') + '$' +
          ' = ' + numeral(obj.rates.KHR).format('0,0.00') + 'R' + ' = ' +
          numeral(obj.rates.THB).format('0,0.00') + 'B';
        list.push({
          label: label,
          value: obj._id
        });
      });
    return list;
  },
  gender: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });
    list.push({
      label: 'Male',
      value: 'M'
    });
    list.push({
      label: 'Female',
      value: 'F'
    });

    return list;
  },
  maritalStatus: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });
    list.push({
      label: 'Single',
      value: 'Single'
    });
    list.push({
      label: 'Married',
      value: 'Married'
    });
    list.push({
      label: 'Divorced',
      value: 'Divorced'
    });
    list.push({
      label: 'Unknown',
      value: 'Unknown'
    });

    return list;
  },
  nationality: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });
    list.push({
      label: "Cambodia",
      value: "KHM"
    });
    list.push({
      label: "Other",
      value: "OTH"
    });

    return list;
  },
  position: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });
    list.push({
      label: "Cashier",
      value: "Cashier"
    });
    list.push({
      label: "Account",
      value: "Accountant"
    });
    list.push({
      label: "Admin",
      value: "Admin"
    });
    list.push({
      label: "Manager",
      value: "Manager"
    });

    return list;
  },
  enDisabled: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });
    list.push({
      label: "Enabled",
      value: "E"
    });
    list.push({
      label: "Disabled",
      value: "D"
    });

    return list;
  },
  paymentMethod: function() {
    var list = [];

    list.push({
      label: "(Select One)",
      value: ""
    });
    list.push({
      label: "One Month",
      value: "OM"
    });
    list.push({
      label: "Three Months",
      value: "TM"
    });
    list.push({
      label: "Six Months",
      value: "SM"
    });
    list.push({
      label: "One Year",
      value: "OY"
    });
    list.push({
      label: "Mid Term",
      value: "MT"
    });
    list.push({
      label: "One Term",
      value: "OT"
    });

    return list;
  },
  paymentMethodTerm: function() {
    var list = [];
    //list.push({label: "(Select One)", value: ""});

    var term = School.ListState.get(['course', 'term']);
    if (term && term > 0) {
      //list = [];
      _.times(term, function(n) {
        n += 1;
        list.push({
          label: n + " Month",
          value: n
        });
      });
    }

    return list;
  },
  dayOfWeek: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });
    list.push({
      label: "Monday-Friday",
      value: "Mon-Fri"
    });
    list.push({
      label: "Monday-Saturday",
      value: "Mon-Sat"
    });
    list.push({
      label: "Saturday-Sunday",
      value: "Sat-Sun"
    });

    return list;
  },
  group: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });
    list.push({
      label: "Morning",
      value: "Morning"
    });
    list.push({
      label: "Afternoon",
      value: "Afternoon"
    });
    list.push({
      label: "Evening",
      value: "Evening"
    });
    list.push({
      label: "Full",
      value: "Full"
    });

    return list;
  },
  department: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });

    School.Collection.Department.find()
      .forEach(function(obj) {
        list.push({
          label: obj._id + ' | ' + obj.name + ' (' + obj.shortName +
            ')',
          value: obj._id
        });
      });

    return list;
  },
  course: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });

    School.Collection.Course.find({
        status: 'E'
      })
      .forEach(function(obj) {
        var label = obj._id + ' | ' + obj.name +
          ' (' + obj._department.shortName + ')' +
          ' | Term: ' + obj.term + ' Months (' +
          numeral(obj.baseAmount).format('0,0.00') + ')';
        list.push({
          label: label,
          value: obj._id
        });
      });

    return list;
  },
  room: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });

    School.Collection.Room.find({
        cpanel_branchId: Session.get('currentBranch')
      })
      .forEach(function(obj) {
        list.push({
          label: obj._id + ' | ' + obj.name + ' (' + obj.number + ')',
          value: obj._id
        });
      });

    return list;
  },
  class: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });

    School.Collection.Class.find({
        cpanel_branchId: Session.get('currentBranch')
      })
      .forEach(function(obj) {
        var courseDoc = School.Collection.Course.findOne(obj.courseId);
        var departmentDoc = School.Collection.Department.findOne(
          courseDoc.departmentId);
        var roomDoc = School.Collection.Room.findOne(obj.roomId);

        var label = 'Room: ' + roomDoc.name + ' | Day: ' + obj.dayOfWeek +
          ' (' + obj.group + ')' + ' | Date: ' + obj.startDate + ' To ' +
          obj.endDate;

        list.push({
          label: label,
          value: obj._id
        });
      });

    return list;
  },
  classForCourse: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });

    var courseId = School.ListState.get(['register', 'courseId']);
    if (!_.isUndefined(courseId) && !_.isEmpty(courseId)) {
      School.Collection.Class.find({
        cpanel_branchId: Session.get('currentBranch'),
        courseId: courseId,
        status: 'Active'
      }).forEach(function(obj) {
        var label = obj.name + ' | R: ' + obj._room.name + ' | D: ' +
          obj.dayOfWeek + ' (' + obj.group + ')';

        list.push({
          label: label,
          value: obj._id
        });
      });
    }

    return list;
  },
  student: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });

    School.Collection.Student.find({
        cpanel_branchId: Session.get('currentBranch')
      })
      .forEach(function(obj) {
        var label = obj._id + ' | ' + obj.khName + ', ' + obj.enName +
          ' (' + obj.gender + ')';
        list.push({
          label: label,
          value: obj._id
        });
      });

    return list;
  },
  registerForStudent: function() {
    var list = [];
    var studentId = School.ListState.get(['payment', 'studentId']);

    list.push({
      label: "(Select One)",
      value: ""
    });

    if (!_.isUndefined(studentId) && !_.isEmpty(studentId)) {
      School.Collection.Register.find({
        studentId: studentId,
        cpanel_branchId: Session.get('currentBranch')
      }, {
        sort: {
          _id: -1
        }
      }).forEach(function(obj) {
        var classDoc = School.Collection.Class.findOne(obj.classId);
        var roomDoc = School.Collection.Room.findOne(classDoc.roomId);
        var courseDoc = School.Collection.Course.findOne(classDoc.courseId);
        var departmentDoc = School.Collection.Department.findOne(
          courseDoc.departmentId);

        var label = 'Course: ' + courseDoc.name + ' (' + departmentDoc.shortName +
          ') | Period: ' + courseDoc.period + ' months | Rome: ' +
          roomDoc.name + ' | Day: ' + classDoc.dayOfWeek;
        //+ ' | Group: ' + classDoc.group;
        //+ ' | Time: ' + classDoc.time + ' | Date: ' + classDoc.startDate + ' To ' + classDoc.endDate;

        list.push({
          label: label,
          value: obj._id
        });
      });
    }

    return list;
  },
  //defaultPaymentMethodForRegister: function () {
  //    var list = [];
  //    list.push({label: "(Select One)", value: ""});
  //
  //    // Get state on payment form
  //    var courseId = School.ListState.get(['register', 'courseId']);
  //    if (!_.isUndefined(courseId) && !_.isEmpty(courseId)) {
  //        var courseDoc = School.Collection.Course.findOne(courseId);
  //
  //        if (!_.isUndefined(courseDoc)) {
  //            // Each method
  //            _.each(courseDoc.paymentMethod, function (obj) {
  //                var label = obj.name + ' : ' + numeral(obj.amount).format('0,0.00');
  //                var value = {name: obj.name, amount: obj.amount};
  //
  //                list.push({label: label, value: JSON.stringify(value)});
  //            });
  //        }
  //    }
  //
  //    return list;
  //},
  paymentMethodForPayment: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });

    // Get state on payment form
    var registerDoc = School.ListState.get(['payment', 'registerDoc']);
    if (!_.isUndefined(registerDoc)) {
      var lastPaymentDoc = School.ListState.get(['payment',
        'lastPaymentDoc'
      ]);
      var paymentMethod = registerDoc._class._course.paymentMethod;

      // Check over due
      if (lastPaymentDoc.owedAmount > 0) {
        paymentMethod = JSON.parse(lastPaymentDoc.paymentMethod);
        var owedAmountLabel = paymentMethod.term + " Month = " + numeral(
          lastPaymentDoc.owedAmount).format('0,0.00') + ' (Owed Amount)';
        var owedAmountVal = {
          term: paymentMethod.term,
          cost: 0,
          discount: 0,
          amount: lastPaymentDoc.owedAmount
        };

        list.push({
          label: owedAmountLabel,
          value: JSON.stringify(owedAmountVal)
        });
      } else {
        // Each method
        _.each(paymentMethod, function(obj) {
          var label = obj.term + ' Month = ' +
            numeral(obj.amount).format('0,0.00') +
            ' (Cost: ' + numeral(obj.cost).format('0,0.00') + ')';
          list.push({
            label: label,
            value: JSON.stringify(obj)
          });
        });
      }
    }

    return list;
  },
  staff: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });

    School.Collection.Staff.find({
        cpanel_branchId: Session.get('currentBranch')
      })
      .forEach(function(obj) {
        list.push({
          label: obj._id + ' | ' + obj.name,
          value: obj._id
        });
      });

    return list;
  },
  teacher: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });

    School.Collection.Teacher.find({
        cpanel_branchId: Session.get('currentBranch')
      })
      .forEach(function(obj) {
        list.push({
          label: obj._id + ' | ' + obj.name,
          value: obj._id
        });
      });

    return list;
  },
  //
  register: function() {
    var list = [];
    var studentId = Session.get('student');

    list.push({
      label: "(Select One)",
      value: ""
    });

    if (!_.isUndefined(studentId) && !_.isEmpty(studentId)) {
      School.Collection.Register.find({
        studentId: studentId,
        cpanel_branchId: Session.get('currentBranch')
      }, {
        sort: {
          _id: -1
        }
      }).forEach(function(obj) {
        var classDoc = School.Collection.Class.findOne(obj.classId);
        var roomDoc = School.Collection.Room.findOne(classDoc.roomId);
        var courseDoc = School.Collection.Course.findOne(classDoc.courseId);
        var departmentDoc = School.Collection.Department.findOne(
          courseDoc.departmentId);

        var label = 'Course: ' + courseDoc.name + ' (' + departmentDoc.shortName +
          ') | Period: ' + courseDoc.period + ' months | Rome: ' +
          roomDoc.name + ' | Day: ' + classDoc.dayOfWeek;
        //+ ' | Group: ' + classDoc.group;
        //+ ' | Time: ' + classDoc.time + ' | Date: ' + classDoc.startDate + ' To ' + classDoc.endDate;

        list.push({
          label: label,
          value: obj._id
        });
      });
    }

    return list;
  },
  registerStatus: function() {
    var list = [];
    list.push({
      label: "(Select One)",
      value: ""
    });
    list.push({
      label: 'Reactive',
      value: 'Reactive'
    });
    list.push({
      label: 'Suspend',
      value: 'Suspend'
    });
    list.push({
      label: 'Dropout',
      value: 'Dropout'
    });

    return list;
  },
  branchForUser: function(selectOne, userId) {
    var list = [];
    if (!_.isEqual(selectOne, false)) {
      list.push({
        label: "All",
        value: ""
      });
    }
    var userId = _.isUndefined(userId) ? Meteor.userId() : userId;
    Meteor.users.findOne(userId).rolesBranch
      .forEach(function(branch) {
        var label = Cpanel.Collection.Branch.findOne(branch).enName;
        list.push({
          label: label,
          value: branch
        });
      });
    return list;
  },
  backupAndRestoreTypes: function() {
    return [{
      value: '',
      label: 'Select One'
    }, {
      value: 'Setting',
      label: 'Setting'
    }, {
      value: 'Default',
      label: 'Default'
    }, {
      value: 'Setting,Default',
      label: 'Setting And Default'
    }];
  },
  // type Waive || Normal on payment
  type: function() {
    return [{
      value: '',
      label: '(Select One)'
    }, {
      value: 'Normal',
      label: 'Normal'
    }, {
      value: 'Waive',
      label: 'Waive'
    }];
  }
};
