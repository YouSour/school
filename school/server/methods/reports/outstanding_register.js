Meteor.methods({
  school_outstandingRegisterReport: function(params) {
    this.unblock();

    var data = {
      title: {},
      header: {},
      content: [{
        index: 'No Result'
      }],
      footer: {}
    };

    var date = moment(params.date).add(1, 'days').toDate();

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

    selector.registerDate = {
      $lt: date
    };
    if (!_.isEmpty(params.branch)) {
      selector.cpanel_branchId = params.branch;
    }
    if (!_.isEmpty(params.department)) {
      selector['_class._course.departmentId'] = params.department;
    }
    if (!_.isEmpty(params.course)) {
      selector.courseId = params.course;
    }
    if (!_.isEmpty(params.newOld)) {
      selector.newOld = params.newOld;
    }

    // Check class status
    selector.$or = [{
      '_class.status': 'Active'
    }, {
      '_class.status': 'Close',
      '_class.statusDate': {
        $gte: date
      }
    }];


    var index = 1;
    var subTotalSumOfPaid = 0,
      subTotalOS = 0;
    School.Collection.Register.find(selector, {
        sort: {
          registerDate: 1
        }
      })
      .forEach(function(obj) {
        /**
         * Check last status
         */
        var status = 'Active';
        if (obj._statusBack) {
          var lastStatus = _.chain(obj._statusBack)
            .sortBy('_id')
            .filter(function(val) {
              return moment(val.statusDate).format('YYYY-MM-DD') <
                moment(date).format('YYYY-MM-DD');
            })
            .last()
            .value();

          if (!_.isEmpty(lastStatus)) {
            status = lastStatus.status == 'Reactive' ? 'Active' :
              lastStatus.status;
          }
        }
        obj.status = status;

        // Check status
        var resultStatus = true;
        if (!_.isEmpty(params.status) && params.status != obj.status) {
          resultStatus = false;
        }

        if (resultStatus) {
          obj.sumOfPaid = 0;
          obj.OSAmount = math.round(obj._class._course.term * obj._class
            ._course.baseAmount, 2);

          // Get last payment
          obj.lastPaymentObj = {};
          if (obj._paymentBack) {
            var lastPayment = _.chain(obj._paymentBack)
              .sortBy('_id')
              .filter(function(val) {
                return moment(val.paymentDate).format('YYYY-MM-DD') <
                  moment(date).format('YYYY-MM-DD');
              })
              .last()
              .value();
            if (!_.isEmpty(lastPayment)) {
              obj.lastPaymentObj = lastPayment;
              obj.sumOfPaid = lastPayment.sumOfPaid;
              obj.OSAmount = lastPayment.outstandingAmount;
            }
          }

          /*** Check OS Amount ***/
          var osAmountResult = true;
          if (!_.isEmpty(params.osAmont)) {
            if (params.osAmount == '> 0' && obj.OSAmount > 0) {
              osAmountResult = true;
            } else if (params.osAmount == '= 0' && obj.OSAmount == 0) {
              osAmountResult == true;
            } else {
              osAmountResult = false;
            }
          }

          if (osAmountResult) {
            subTotalSumOfPaid += obj.sumOfPaid;
            subTotalOS += obj.OSAmount;

            obj.index = index;
            obj.paymentMethodStr = JSON.stringify(obj._class._course.paymentMethod,
              null, ' ');

            content.push(obj);

            index++;
          }
        }
      });

    // Exchange
    fx.base = exchangeDoc.base;
    fx.rates = exchangeDoc.rates;

    var subTotalSumOfPaidKhr = fx.convert(subTotalSumOfPaid, {
      from: 'USD',
      to: "KHR"
    });
    subTotalSumOfPaidKhr = roundKhr(subTotalSumOfPaidKhr);
    var subTotalSumOfPaidThb = fx.convert(subTotalSumOfPaid, {
      from: 'USD',
      to: "THB"
    });
    subTotalSumOfPaidThb = math.round(subTotalSumOfPaidThb);

    data.footer = {
      subTotalSumOfPaid: subTotalSumOfPaid,
      subTotalSumOfPaidKhr: subTotalSumOfPaidKhr,
      subTotalSumOfPaidThb: subTotalSumOfPaidThb
    };

    if (content.length > 0) {
      data.content = content;
    }

    return data;
  }
});
