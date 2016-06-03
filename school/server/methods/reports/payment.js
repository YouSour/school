Meteor.methods({
  school_paymentReport: function(params) {
    this.unblock();

    var data = {
      title: {},
      header: {},
      content: [{
        index: 'No Result'
      }],
      footer: {}
    };

    var date = s.words(params.date, ' To ');
    var fDate = moment(date[0], 'YYYY-MM-DD').toDate();
    var tDate = moment(date[1], 'YYYY-MM-DD').add(1, 'days').toDate();

    /****** Title *****/
    data.title = Cpanel.Collection.Company.findOne();

    /****** Header *****/
    var paramsHeader = _.clone(params);
    var exchangeDoc = Cpanel.Collection.Exchange.findOne(params.exchange);
    paramsHeader.exchangeStr = JSON.stringify(exchangeDoc.rates, null, ' ');

    var branchDoc = Cpanel.Collection.Branch.findOne(params.branch);
    if (!_.isUndefined(branchDoc)) {
      paramsHeader.branch = branchDoc._id + " : " + branchDoc.enName;
    }

    var departmentDoc = School.Collection.Department.findOne(params.department);
    if (!_.isUndefined(departmentDoc)) {
      paramsHeader.department = departmentDoc._id + " : " + departmentDoc.name;
    }

    var courseDoc = School.Collection.Course.findOne(params.course);
    if (!_.isUndefined(courseDoc)) {
      paramsHeader.course = courseDoc._id + " : " + courseDoc.name;
    }

    var staffDoc = School.Collection.Staff.findOne(params.staff);
    if (!_.isUndefined(staffDoc)) {
      paramsHeader.staff = staffDoc._id + " : " + staffDoc.name;
    }

    data.header = paramsHeader;

    /****** Content *****/
    var content = [];
    var selector = {};

    selector.paymentDate = {
      $gte: fDate,
      $lte: tDate
    };
    if (!_.isEmpty(params.branch)) {
      selector.cpanel_branchId = params.branch;
    }
    if (!_.isEmpty(params.department)) {
      selector['_register._class._course.departmentId'] = params.department;
    }
    if (!_.isEmpty(params.course)) {
      selector['_register.courseId'] = params.course;
    }
    if (!_.isEmpty(params.newOld)) {
      selector['_register.newOld'] = params.newOld;
    }
    if (!_.isEmpty(params.type)) {
      selector['type'] = params.type;
    }
    if (!_.isEmpty(params.staff)) {
      selector['staffId'] = params.staff;
    }

    var index = 1;
    var subTotal = 0,
      subPaid = 0,
      subOwed = 0,
      subOut = 0;
    School.Collection.Payment.find(selector, {
        sort: {
          paymentDate: 1,
          '_register._student.khName': 1
        }
      })
      .forEach(function(obj) {
        // Do something
        obj.index = index;

        // Payment Method
        obj.paymentMethodObj = JSON.parse(obj.paymentMethod);

        subTotal += obj.totalAmount;
        subPaid += obj.paidAmount;
        subOwed += obj.owedAmount;
        subOut += obj.outstandingAmount;

        content.push(obj);

        index++;
      });

    // Exchange
    fx.base = exchangeDoc.base;
    fx.rates = exchangeDoc.rates;

    var subTotalKhr = fx.convert(subTotal, {
      from: 'USD',
      to: "KHR"
    });
    subTotalKhr = roundKhr(subTotalKhr);
    var subTotalThb = fx.convert(subTotal, {
      from: 'USD',
      to: "THB"
    });
    subTotalThb = math.round(subTotalThb);

    var subPaidKhr = fx.convert(subPaid, {
      from: 'USD',
      to: "KHR"
    });
    subPaidKhr = roundKhr(subPaidKhr);
    var subPaidThb = fx.convert(subPaid, {
      from: 'USD',
      to: "THB"
    });
    subPaidThb = math.round(subPaidThb);

    var subOwedKhr = fx.convert(subOwed, {
      from: 'USD',
      to: "KHR"
    });
    subOwedKhr = roundKhr(subOwedKhr);
    var subOwedThb = fx.convert(subOwed, {
      from: 'USD',
      to: "THB"
    });
    subOwedThb = math.round(subOwedThb);

    var subOutKhr = fx.convert(subOut, {
      from: 'USD',
      to: "KHR"
    });
    subOutKhr = roundKhr(subOutKhr);
    var subOutThb = fx.convert(subOut, {
      from: 'USD',
      to: "THB"
    });
    subOutThb = math.round(subOutThb);

    data.footer = {
      subTotal: subTotal,
      subTotalKhr: subTotalKhr,
      subTotalThb: subTotalThb,
      subPaid: subPaid,
      subPaidKhr: subPaidKhr,
      subPaidThb: subPaidThb,
      subOwed: subOwed,
      subOwedKhr: subOwedKhr,
      subOwedThb: subOwedThb,
      subOut: subOut,
      subOutKhr: subOutKhr,
      subOutThb: subOutThb
    };

    if (content.length > 0) {
      data.content = content;
    }

    return data;
  }
});
