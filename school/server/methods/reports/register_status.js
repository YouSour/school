Meteor.methods({
  school_registerStatusReport: function(params) {
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

    data.header = paramsHeader;

    /****** Content *****/
    var content = [];
    var selector = {};

    selector.statusDate = {
      $gte: fDate,
      $lt: tDate
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
    if (!_.isEmpty(params.status)) {
      selector.status = params.status;
    }

    var index = 1;
    var subTotal = 0,
      subTotalOS = 0;
    School.Collection.RegisterStatus.find(selector, {
        sort: {
          statusDate: 1
        }
      })
      .forEach(function(obj) {
        // Get last payment
        obj.paymentObj = {};
        var lastPayment = School.Collection.Payment.findOne({
          registerId: obj.registerId,
          paymentDate: {
            $lt: tDate
          }
        }, {
          sort: {
            _id: -1
          }
        });
        if (!_.isUndefined(lastPayment)) {
          obj.paymentObj = lastPayment;
          subTotalOS += lastPayment.outstandingAmount;
        }

        obj.index = index;
        obj.paymentMethodStr = JSON.stringify(obj._register._class._course
          .paymentMethod, null, ' ');

        subTotal += obj._register._class._course.baseAmount;

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

    var subTotalOSKhr = fx.convert(subTotalOS, {
      from: 'USD',
      to: "KHR"
    });
    subTotalOSKhr = roundKhr(subTotalOSKhr);
    var subTotalOSThb = fx.convert(subTotalOS, {
      from: 'USD',
      to: "THB"
    });
    subTotalOSThb = math.round(subTotalOSThb);

    data.footer = {
      subTotal: subTotal,
      subTotalKhr: subTotalKhr,
      subTotalThb: subTotalThb,
      subTotalOS: subTotalOS,
      subTotalOSKhr: subTotalOSKhr,
      subTotalOSThb: subTotalOSThb
    };

    if (content.length > 0) {
      data.content = content;
    }

    return data;
  }
});
