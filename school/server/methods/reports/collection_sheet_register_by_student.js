Meteor.methods({
  school_collectionSheetRegisterByStudentReport: function(params) {
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
    var content = {};
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

    var index = 1;
    // Exchange
    fx.base = exchangeDoc.base;
    fx.rates = exchangeDoc.rates;

    var subTotalSumOfPaid = 0,
      subTotalOwed = 0,
      subTotalDue = 0,
      subTotalOwedAndDue = 0;

    var tempRegisterTransport;
    School.Collection.Register.find(selector, {
        sort: {
          _id: 1
        }
      })
      .forEach(function(obj) {
        /**
         * Check last status
         */
        var company = Cpanel.Collection.Company.findOne();
        obj.exchangeRate = exchangeDoc.rates;
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
        obj.OSAmount = math.round(obj._class._course.term * obj._class._course
          .baseAmount, 2);
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
            // Payment status
            if (lastPayment.status == 'Close') {
              resultPayment = false;
            } else {
              obj.lastPaymentObj = lastPayment;
              obj.sumOfPaid = lastPayment.sumOfPaid;
              obj.OSAmount = lastPayment.outstandingAmount;

              lastOwed = obj.lastPaymentObj.owedAmount;

              subTotalSumOfPaid += obj.sumOfPaid;
              subTotalOwed += lastOwed;

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
        }

        /*** Result ***/
        if (resultStatus && resultPayment) {
          obj.owedTerm = owedTerm;
          var dueAmountTmp = obj._class._course.baseAmount * owedTerm;

          // Check due amount with os
          if (dueAmountTmp > obj.OSAmount) {
            dueAmountTmp = obj.OSAmount;
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

          obj.paymentMethodStr = JSON.stringify(obj._class._course.paymentMethod,
            null, ' ');

          var expiredDateTemp = obj.registerDate;
          if(!_.isUndefined(obj._paymentBack) && obj._paymentCount !== 0){
            expiredDateTemp = _.last(obj._paymentBack).toDate;
          }

          // Check studentId
          var _registerPaymentAdded = {
            _id: obj._id,
            class: obj._class.name,
            group: obj._class.group,
            expiredDate: expiredDateTemp,
            owedTerm: obj.owedTerm,
            baseAmount: obj._class._course.baseAmount,
            owedAmount: obj.oAmount,
            dueAmount: obj.dueAmount,
            totalOwedAndDue: obj.totalOwedAndDue
          };

          if (content[obj.studentId]) {
            //if studentId Exist
            var newTotalOwedAndDue = content[obj.studentId]
              .totalOwedAndDue + obj.totalOwedAndDue;

            content[obj.studentId].totalOwedAndDue = newTotalOwedAndDue;

            content[obj.studentId].grandTotal = content[obj.studentId].grandTotal +
              obj.totalOwedAndDue;
            content[obj.studentId]._registerPayment.push(
              _registerPaymentAdded);

          } else {
            //if studentId don't Exist
            //Check transpot
            var registerTransport = School.Collection.Transport.findOne({
              studentId: obj.studentId
            }, {
              sort: {
                transportDate: -1
              }
            });

            var _registerTransportAdded = {};

            if (!_.isUndefined(registerTransport)) {
              if (registerTransport.toDate <= date) {
                _registerTransportAdded = {
                  _id: registerTransport._id,
                  transportDate: registerTransport.transportDate,
                  expiredDate: registerTransport.toDate,
                  term: registerTransport.term,
                  service: JSON.parse(registerTransport.service).name,
                  totalAmount: registerTransport.totalAmount
                };
              }
            }

            //check totalOwedAndDue & totalAmount
            var totalOwedAndDueTemp = (obj.totalOwedAndDue !==
              undefined) ? obj.totalOwedAndDue : 0;


            var totalAmountTemp = (_registerTransportAdded.totalAmount !==
              undefined) ? _registerTransportAdded.totalAmount : 0;

              var grandTotalKhrTemp = fx.convert(totalAmountTemp + totalOwedAndDueTemp, {
                from: 'USD',
                to: "KHR"
              });
              grandTotalKhrTemp = roundKhr(grandTotalKhrTemp);

              grandTotalThbTemp = fx.convert(totalAmountTemp + totalOwedAndDueTemp, {
                from: 'USD',
                to: "THB"
              });
              grandTotalThbTemp = math.round(grandTotalThbTemp);

            // Push content
            content[obj.studentId] = {
              index : index,
              studentId: obj.studentId,
              companyInfo: {
                cKhName: company.khName,
                cEnName: company.enName,
                cKhAddress: company.khAddress,
                cTelephone: company.telephone
              },
              exchange: numeral(exchangeDoc.rates.USD).format('0,0.00 $') +" = "+ numeral(exchangeDoc.rates.KHR).format('0,0.00')+" R = "+ numeral(exchangeDoc.rates.THB).format('0,0.00')+" B",
              _registerTransport: [_registerTransportAdded],
              _registerPayment: [_registerPaymentAdded],
              _student: obj._student,
              totalOwedAndDue: obj.totalOwedAndDue,
              grandTotal: totalAmountTemp + totalOwedAndDueTemp,
              grandTotalKhr : grandTotalKhrTemp,
              grandTotalThb : grandTotalThbTemp
            };
          }
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
      subTotalOwedAndDueThb: subTotalOwedAndDueThb
    };

    //Convert Content obj to array
    content = _.map(content);

    if (content.length > 0) {
      data.content = content;
    }

    return data;
  }
});
