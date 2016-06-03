Meteor.methods({
    school_closingRegisterReport: function (params) {
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

        selector['_class.status'] = 'Close';
        selector['_class.statusDate'] = {
            $gte: fDate,
            $lt: tDate
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
        var subTotal = 0,
            subTotalSumOfPaid = 0,
            subTotalOS = 0;
        School.Collection.Register.find(selector, {
                sort: {
                    registerDate: 1
                }
            })
            .forEach(function (obj) {
                // Check last status
                var status = 'Active';
                if (obj._statusBack) {
                    var lastStatus = _.chain(obj._statusBack)
                        .sortBy('_id')
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

                /*** Check result status ***/
                if (resultStatus) {
                    obj.index = index;
                    obj.paymentMethodStr = JSON.stringify(obj._class._course.paymentMethod,
                        null, ' ');

                    // Get last payment
                    obj.sumOfPaid = 0;
                    obj.OSAmount = math.round(obj._class._course.term * obj._class
                            ._course.baseAmount, 2);

                    obj.lastPyament = {};
                    if (obj._paymentBack) {
                        var lastPayment = _.chain(obj._paymentBack)
                            .sortBy('_id')
                            .last()
                            .value();
                        if (!_.isEmpty(lastPayment)) {
                            obj.sumOfPaid = lastPayment.sumOfPaid;
                            obj.OSAmount = lastPayment.outstandingAmount;

                            obj.lastPyament = lastPayment;
                        }
                    }
                    subTotal += obj._class._course.baseAmount;
                    subTotalSumOfPaid += obj.sumOfPaid;
                    subTotalOS += obj.OSAmount;

                    content.push(obj);

                    index++;
                }
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

            subTotalSumOfPaid: subTotalSumOfPaid,
            subTotalSumOfPaidKhr: subTotalSumOfPaidKhr,
            subTotalSumOfPaidThb: subTotalSumOfPaidThb,

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
