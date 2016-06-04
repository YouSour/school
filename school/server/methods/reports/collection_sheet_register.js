Meteor.methods({
  school_collectionSheetRegisterReport: function(params) {
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
    paramsHeader.exchangeStr = JSON.stringify(exchangeDoc.rates, null,
      ' ');

    var branchDoc = Cpanel.Collection.Branch.findOne(params.branch);
    if (!_.isUndefined(branchDoc)) {
      paramsHeader.branch = branchDoc._id + " : " + branchDoc.enName;
    }

    var departmentDoc = School.Collection.Department.findOne(params.department);
    if (!_.isUndefined(departmentDoc)) {
      paramsHeader.department = departmentDoc._id + " : " + departmentDoc
        .name;
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

    // Check payment back
    //selector.$or = [
    //    {_paymentBack: {$exists: false}},
    //    {
    //        $or: [
    //            {
    //                _paymentBack: {
    //                    $elemMatch: {
    //                        toDate: {$lt: date}
    //                    }
    //                }
    //            },
    //            {
    //                _paymentBack: {
    //                    $elemMatch: {
    //                        fromDate: {$lt: date},
    //                        outstandingAmount: {$gt: 0}
    //                    }
    //                }
    //            }
    //        ]
    //    }
    //];

    // Check status back
    //if (params.status == 'Re-active') {
    //    // Check status
    //    selector.$or = [
    //        {_statusBack: {$exists: false}},
    //        {
    //            _statusBack: {
    //                $elemMatch: {
    //                    statusDate: {$lt: date},
    //                    status: 'Reactive'
    //                }
    //            }
    //        }
    //    ];
    //} else {
    //    // Check status
    //    selector.$or = [
    //        {_statusBack: {$exists: true}},
    //        {
    //            _statusBack: {
    //                $elemMatch: {
    //                    statusDate: {$lt: date},
    //                    status: params.status
    //                }
    //            }
    //        }
    //    ];


    var index = 1;
    // Exchange
    fx.base = exchangeDoc.base;
    fx.rates = exchangeDoc.rates;

    //}
    var subTotalSumOfPaid = 0,
      subTotalOwed = 0,
      subTotalDue = 0,
      subTotalOwedAndDue = 0,
      subTotalOsAmount = 0;
    School.Collection.Register.find(selector, {
        sort: {
          '_student.khName': 1
        }
      })
      .forEach(function(obj) {
        /**
         * Check last status
         */
        var company = Cpanel.Collection.Company.findOne();
        obj.cKhName = company.khName;
        obj.cEnName = company.enName;
        obj.cKhAddress = company.khAddress;
        obj.cTelephone = company.telephone;
        obj.exchangeRate = exchangeDoc.rates;

        obj.lastMethod = obj._class._course.paymentMethod[0].cost + " / " + obj._class._course.paymentMethod[0].term + "ខែ";

        var status = 'Active';
        if (obj._statusBack && !_.isEmpty(obj._statusBack)) {

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

        var resultStatus = true;
        if (!_.isEmpty(params.status) && params.status != status) {
          resultStatus = false;
        }

        /**
         * Check last payment
         */
        var resultPayment = true;

        // Get last payment
        var lastOwed = 0;
        var owedTerm = moment(date).diff(moment(obj.registerDate),
          'months') + 1;

        obj.sumOfPaid = 0;
        //if no expire date os amout equal term x base amount
        obj.OSAmount = math.round(obj._class._course.term * obj._class._course
          .baseAmount, 2);
        //

        obj.lastPaymentObj = {};

        if (obj._paymentBack && !_.isEmpty(obj._paymentBack)) {
          var lastPayment = _.chain(obj._paymentBack)
            .sortBy('_id')
            .filter(function(val) {
              return (moment(val.paymentDate).format('YYYY-MM-DD') <
                moment(date).format('YYYY-MM-DD'));
            })
            .last()
            .value();
          if (!_.isEmpty(lastPayment) && (moment(lastPayment.toDate).format(
              'YYYY-MM-DD') < moment(date).format('YYYY-MM-DD') || (
              moment(lastPayment.fromDate).format('YYYY-MM-DD') <
              moment(date).format('YYYY-MM-DD') && lastPayment.owedAmount >
              0))) {

                var convertPaymentMethod = JSON.parse(lastPayment.paymentMethod);

                obj.lastMethodCost = convertPaymentMethod.cost;
                obj.lastMethod = convertPaymentMethod.cost+"​ /​ "+ convertPaymentMethod.term +"ខែ";

                //multiplicand
                var monthDiff = moment(date).diff(moment(lastPayment.paymentDate),
                  'months') + 1;

                  var multiplicandTmp = math.round(monthDiff / convertPaymentMethod.term);
                  obj.multiplicand = multiplicandTmp;

            if (lastPayment.status == 'Close') {
              resultPayment = false;
            } else {
              obj.lastPaymentObj = lastPayment;
              obj.sumOfPaid = lastPayment.sumOfPaid;
              obj.OSAmount = lastPayment.outstandingAmount;
              obj.lastOverDue = lastPayment.owedAmount;

              subTotalSumOfPaid += obj.sumOfPaid;
              subTotalOwed += lastPayment.owedAmount;
              lastOwed = lastPayment.owedAmount;

              // Payment status

              // Cal owedTerm, dueAmount
              if (moment(lastPayment.toDate).format('YYYY-MM-DD') <
                moment(date).format('YYYY-MM-DD')) {
                owedTerm = moment(date).diff(moment(lastPayment.toDate),
                  'months') + 1;

              } else {
                owedTerm = 0;
              }
            }
          } else {
            resultPayment = false;
          }
        }else {
          obj.multiplicand = owedTerm;
        }


        /*** Result ***/
        if (resultStatus && resultPayment) {
          obj.owedTerm = owedTerm;

          var dueAmountTmp = obj._class._course.baseAmount * owedTerm;
          
          if(!_.isUndefined(obj.lastMethodCost)){
            dueAmountTmp = obj.lastMethodCost * obj.multiplicand;
          }

          // Check due amount with os
          if (dueAmountTmp > obj.OSAmount) {
            dueAmountTmp = obj.OSAmount - obj.lastOverDue ;
          }
          //check dueAmountTmp nan
          if (_.isNaN(dueAmountTmp)){
            dueAmountTmp = obj.OSAmount
          }


          obj.dueAmount = dueAmountTmp;
          subTotalDue += obj.dueAmount;

          obj.totalOwedAndDue = lastOwed + obj.dueAmount;
          //convert USD To KHR on TotalAmount CollectionSheet Invoice
          var totalOwedAndDueKhrTemp = fx.convert(obj.totalOwedAndDue, {
            from: 'USD',
            to: "KHR"
          });
          obj.totalOwedAndDueKhr = roundKhr(totalOwedAndDueKhrTemp);

          //convert USD To THB on TotalAmount CollectionSheet Invoice
          var totalOwedAndDueThbTemp = fx.convert(obj.totalOwedAndDue, {
            from: 'USD',
            to: "THB"
          });
          obj.totalOwedAndDueThb = math.round(totalOwedAndDueThbTemp);

          subTotalOwedAndDue += obj.totalOwedAndDue;

          subTotalOsAmount += obj.OSAmount;

          obj.index = index;
          obj.paymentMethodStr = JSON.stringify(obj._class._course.paymentMethod,
            null, ' ');

          content.push(obj);

          index++;
        }
      });

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

    var subTotalOwedKhr = fx.convert(subTotalOwed, {
      from: 'USD',
      to: "KHR"
    });
    subTotalOwedKhr = roundKhr(subTotalOwedKhr);
    var subTotalOwedThb = fx.convert(subTotalOwed, {
      from: 'USD',
      to: "THB"
    });
    subTotalOwedThb = math.round(subTotalOwedThb);

    var subTotalDueKhr = fx.convert(subTotalDue, {
      from: 'USD',
      to: "KHR"
    });
    subTotalDueKhr = roundKhr(subTotalDueKhr);

    var subTotalDueThb = fx.convert(subTotalDue, {
      from: 'USD',
      to: "THB"
    });
    subTotalDueThb = math.round(subTotalDueThb);

    var subTotalOwedAndDueKhr = fx.convert(subTotalOwedAndDue, {
      from: 'USD',
      to: "KHR"
    });
    subTotalOwedAndDueKhr = roundKhr(subTotalOwedAndDueKhr);

    var subTotalOwedAndDueThb = fx.convert(subTotalOwedAndDue, {
      from: 'USD',
      to: "THB"
    });
    subTotalOwedAndDueThb = math.round(subTotalOwedAndDueThb);


    var subTotalOsAmountKhr = fx.convert(subTotalOsAmount, {
      from: 'USD',
      to: "KHR"
    });
    subTotalOsAmountKhr = roundKhr(subTotalOsAmountKhr);

    var subTotalOsAmountThb = fx.convert(subTotalOsAmount, {
      from: 'USD',
      to: "THB"
    });
    subTotalOsAmountThb = math.round(subTotalOsAmountThb);

    data.content.objTotalOwedAndDue = {
      subTotalOwedAndDue: subTotalOwedAndDue,
      subTotalOwedAndDueKhr: subTotalOwedAndDueKhr,
      subTotalOwedAndDueThb: subTotalOwedAndDueThb
    };

    data.footer = {
      subTotalSumOfPaid: subTotalSumOfPaid,
      subTotalSumOfPaidKhr: subTotalSumOfPaidKhr,
      subTotalSumOfPaidThb: subTotalSumOfPaidThb,

      subTotalOwed: subTotalOwed,
      subTotalOwedKhr: subTotalOwedKhr,
      subTotalOwedThb: subTotalOwedThb,

      subTotalDue: subTotalDue,
      subTotalDueKhr: subTotalDueKhr,
      subTotalDueThb: subTotalDueThb,

      subTotalOwedAndDue: subTotalOwedAndDue,
      subTotalOwedAndDueKhr: subTotalOwedAndDueKhr,
      subTotalOwedAndDueThb: subTotalOwedAndDueThb,

      subTotalOsAmount : subTotalOsAmount,
      subTotalOsAmountKhr : subTotalOsAmountKhr,
      subTotalOsAmountThb : subTotalOsAmountThb
    };

    if (content.length > 0) {
      data.content = content;
    }

    return data;
  }
});
