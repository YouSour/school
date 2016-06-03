/****************** Declare template ************/
var indexTpl = Template.school_payment,
    insertTpl = Template.school_paymentInsert,
    updateTpl = Template.school_paymentUpdate,
    showTpl = Template.school_paymentShow,

    registerShowTpl = Template.school_registerShow;
staffInsertAddonTpl = Template.school_staffInsert;

/************* Declare reactive obj ***************/
var state = new ReactiveObj({
    registerDoc: {},
    lastPaymentDoc: {},
    paymentDate: '',
    paymentMethod: {},
    fromDate: '',
    toDate: '',
    // Amount
    exchange: {},
    dueAmount: 0,
    discount: 0,
    paid: 0,
    status: 'Normal',
    submitType: 'save'
});

/******************** Index *********************/
indexTpl.onCreated(function () {
    // SEO
    SEO.set({
        title: 'Payment',
        description: 'Description for this page'
    });

    // Create new  alertify
    createNewAlertify(['payment', 'staff']);
});

indexTpl.helpers({
    selector: function () {
        var registerId = FlowRouter.getParam('registerId');

        return {registerId: registerId};
    },
    register: function () {
        var registerId = FlowRouter.getParam('registerId');
        var data = School.Collection.Register.findOne(registerId);
        data._student.photoUrl = null;

        if (!_.isUndefined(data._student.photo)) {
            data._student.photoUrl = Files.findOne(data._student.photo).url();
        }

        return data;
    }
});

indexTpl.events({
    'click .jsRegisterInfo': function (e, t) {
        alertify.alert(fa("eye", "Register"), renderTemplate(registerShowTpl, this).html);
    },
    'click .insert': function (e, t) {
        // Check closing
        var registerId = FlowRouter.getParam('registerId');
        var payment = School.Collection.Payment.findOne({registerId: registerId, status: 'C'});
        if (payment) {
            alertify.error('You can\'t add new, because it has been closed');
        } else {
            alertify.payment(fa("plus", "Payment"), renderTemplate(insertTpl))
                .maximize();
        }
    },
    'click .remove': function (e, t) {
        var self = this;
        // Check last record or not
        //var getLast = lastPayment(self._id);
        alertify.confirm(
            fa("remove", "Payment"),
            "Are you sure to delete [" + self._id + "]?",
            function () {
                School.Collection.Payment.remove(self._id, function (error) {
                    if (error) {
                        alertify.error(error.message);
                    } else {
                        alertify.success("Success");
                    }
                });
            },
            null
        );
    },
    'click .show': function (e, t) {
        var data = School.Collection.Payment.findOne(this._id);

        alertify.alert(fa("eye", "Payment"), renderTemplate(showTpl, data).html);
    },
    'click .printInvoice': function () {
        var params = {};
        var queryParams = {id: this._id};
        var path = FlowRouter.path("school.paymentInvoiceReportGen", params, queryParams);

        window.open(path, '_blank');
    }
});

/******************** Insert  *********************/
insertTpl.onCreated(function () {
    /*** Config min date for payment date and payment method ***/
    var registerId = FlowRouter.getParam('registerId');
    var registerDoc = School.Collection.Register.findOne(registerId);
    state.set('registerDoc', registerDoc);
    School.ListState.set(['payment', 'registerDoc'], registerDoc);

    // Get last payment
    School.ListState.set(['payment', 'lastPaymentDoc'], {});
    var lastPayment = School.Collection.Payment.findOne({registerId: registerId}, {sort: {_id: -1}});
    if (!_.isUndefined(lastPayment)) {
        state.set('lastPaymentDoc', lastPayment);
        School.ListState.set(['payment', 'lastPaymentDoc'], lastPayment);
    }
});

insertTpl.onRendered(function () {
    var paymentDate = $('[name="paymentDate"]');
    state.set('paymentDate', moment(paymentDate).format('YYYY-MM-DD HH:mm:ss'));

    var fromDate = $('[name="fromDate"]');
    var toDate = $('[name="toDate"]');

    /**** Config date picker ***/
    DateTimePicker.dateTime(paymentDate);
    DateTimePicker.date([paymentDate, fromDate, toDate]);

    // Get last payment
    var minPaymentDate = state.get('registerDoc').registerDate;
    if (!_.isEmpty(state.get('lastPaymentDoc'))) {
        minPaymentDate = state.get('lastPaymentDoc').paymentDate;
    }
    minPaymentDate = moment(minPaymentDate).format('YYYY-MM-DD');

    paymentDate.data("DateTimePicker").minDate(minPaymentDate);

    /*** Amount ***/
    Inputmask.currency([
        //$('[name="sumOfPaid"]'),
        $('[name="dueAmount"]'),
        $('[name="discountAmount"]'),
        $('[name="totalAmount"]'),
        $('[name="paidAmount"]'),
        $('[name="owedmount"]'),
        $('[name="outstandingAmount"]')
    ]);

    /*** On change ***/
    paymentDate.on("dp.change", function (e) {
        state.set('paymentDate', moment(e.date).format('YYYY-MM-DD'));
    });
    fromDate.on("dp.change", function (e) {
        state.set('fromDate', moment(e.date).format('YYYY-MM-DD'));
    });
});

insertTpl.helpers({
    registerId: function () {
        return FlowRouter.getParam('registerId');
    },
    fromDate: function () {
        return state.get('fromDate');
    },
    toDate: function () {
        var toDate = moment().format('YYYY-MM-DD');
        var fromDate = state.get('fromDate');
        var paymentMethod = state.get('paymentMethod');
        if (!_.isUndefined(fromDate) && !_.isEmpty(fromDate)) {
            toDate = moment(fromDate).add(paymentMethod.term, 'months').toDate();
            toDate = moment(toDate).format('YYYY-MM-DD');
        }

        return toDate;
    },
    // Amount
    sumOfPaid: function () {
        var sumOfPaidVal = 0;
        var lastPaymentDoc = state.get('lastPaymentDoc');
        if (!_.isEmpty(lastPaymentDoc)) {
            sumOfPaidVal = lastPaymentDoc.sumOfPaid;
        }

        return sumOfPaidVal;
    },
    dueAmount: function () {
        return state.get('dueAmount');
    },
    discount: function () {
        return state.get('discount');
    },
    total: function () {
        var totalUsd = 0, totalKhr = 0, totalThb = 0;

        // Cal
        totalUsd = state.get('dueAmount') - state.get('discount');
        totalUsd = math.round(totalUsd, 2);
        state.set('paid', totalUsd);

        // Exchange
        var exchange = state.get('exchange');
        if (!_.isEmpty(exchange)) {
            fx.base = exchange.base;
            fx.rates = exchange.rates;

            totalKhr = fx.convert(totalUsd, {from: "USD", to: "KHR"});
            totalKhr = roundKhr(totalKhr);
            totalThb = fx.convert(totalUsd, {from: "USD", to: "THB"});
            totalThb = math.round(totalThb);
        }

        return {
            totalUsd: totalUsd,
            totalKhr: totalKhr,
            totalThb: totalThb
        };
    },
    paid: function () {
        return state.get('paid');
    },
    owedAmount: function () {
        var totalUsd = 0;
        totalUsd = state.get('dueAmount') - state.get('discount');
        totalUsd = math.round(totalUsd, 2);
        var owedAmountVal = math.round(totalUsd - state.get('paid'), 2);

        return owedAmountVal;
    },
    outstanding: function () {
        var totalOutstanding = 0, paymentMethodDiscount = 0;

        var registerDoc = state.get('registerDoc');
        if (!_.isEmpty(registerDoc)) {
            totalOutstanding = math.round(registerDoc._class._course.term * registerDoc._class._course.baseAmount, 2);
        }

        var lastPayment = state.get('lastPaymentDoc');
        if (!_.isEmpty(lastPayment)) {
            totalOutstanding = lastPayment.outstandingAmount;
        }

        var paymentMethod = state.get('paymentMethod');
        if (!_.isEmpty(paymentMethod)) {
            paymentMethodDiscount = paymentMethod.discount;
        }

        var paid = state.get('paid');
        var discount = state.get('discount');
        totalOutstanding = math.round(totalOutstanding - (paymentMethodDiscount + paid) - discount, 2);

        var cssClass = 'info';
        if (totalOutstanding == 0) {
            cssClass = 'primary';
        } else if (totalOutstanding < 0) {
            cssClass = 'danger';
        }
        return {amount: totalOutstanding, cssClass: cssClass};
    },
    status: function () {
        return state.get('status');
    },
    voucherId: function () {
        var currentBranch = Session.get('currentBranch');
        var paymentDate = state.get('paymentDate');
        var year = moment(paymentDate).format("YYYY");
        var prefixVoucher = currentBranch + '-' + year;

        Fetcher.setDefault("voucherId", '');
        Fetcher.retrieve('voucherId', 'school_paymentVoucherId', prefixVoucher);

        return Fetcher.get('voucherId');
    }
});

insertTpl.events({
    'change [name="exchangeId"]': function (e) {
        var exchange = Cpanel.Collection.Exchange.findOne($(e.currentTarget).val());
        state.set('exchange', exchange);
    },
    'change [name="paymentMethod"]': function (e, t) {
        var paymentMethodId = t.$('[name="paymentMethod"]').val();
        var fromDate = $('[name="fromDate"]');
        // config from data
        DateTimePicker.date(fromDate);
        fromDate.removeAttr('readonly');

        // Get state
        var registerState = state.get('registerDoc');
        var fromDateVal = registerState.registerDate;

        var paymentMethod = {};
        var dueAmount = 0;
        var discount = 0;

        if (!_.isEmpty(paymentMethodId)) {
            paymentMethod = JSON.parse(paymentMethodId);
            var lastPaymentState = state.get('lastPaymentDoc');

            // Over is selected
            dueAmount = paymentMethod.amount;
            if (paymentMethod.cost > 0) { // Don't owed amount
                if (!_.isEmpty(lastPaymentState)) {
                    fromDateVal = lastPaymentState.toDate;
                }
                // Set status
                state.set('status', 'Normal');
            } else { // Owed amount
                fromDateVal = lastPaymentState.fromDate;
                fromDate.attr('readonly', true);

                // Set status
                state.set('status', 'Owed');
            }

        }

        // Set new value
        fromDateVal = moment(fromDateVal).format('YYYY-MM-DD');
        state.set('fromDate', fromDateVal);
        fromDate.data("DateTimePicker").minDate(fromDateVal);

        state.set('paymentMethod', paymentMethod);
        state.set('dueAmount', dueAmount);
        state.set('discount', discount);

    },
    'keyup [name="discountAmount"]': function (e, t) {
        var discountAmount = parseFloat(t.$('[name="discountAmount"]').val());
        if (_.isNaN(discountAmount)) {
            discountAmount = 0;
        }
        state.set('discount', discountAmount);
    },
    'keyup [name="paidAmount"]': function (e, t) {
        var paidAmount = parseFloat(t.$('[name="paidAmount"]').val());
        if (_.isNaN(paidAmount)) {
            paidAmount = 0;
        }
        state.set('paid', paidAmount);
    },
    'click .staffInsertAddon': function (e, t) {
        alertify.staff(fa("plus", "Staff"), renderTemplate(staffInsertAddonTpl));
    },
    'click .save': function (e, t) {
        var submitType = e.currentTarget.id;
        // Set new submitType state
        state.set('submitType', submitType)
    },
    'reset form': function (e, t) {
        clearSelect2();
    }
});


/******************** Hook  *********************/
AutoForm.hooks({
    school_paymentInsert: {
        before: {
            insert: function (doc) {
                var currentBranch = Session.get('currentBranch');

                doc._id = idGenerator.genWithPrefix(School.Collection.Payment, doc.registerId, 3);

                // Set sum of paid
                doc.sumOfPaid += doc.paidAmount;

                // Set status
                if (doc.outstandingAmount == 0) {
                    doc.status = 'Close';
                }

                // Voucher
                //if (!_.isEmpty(doc.voucherId)) {
                //    var yearMonth = $('input[name="paymentDate"]').val();
                //    var date = moment(yearMonth).format("YYYY");
                //    var prefixVoucher = currentBranch + '-' + date;
                //    doc.voucherId = prefixVoucher + s.pad(doc.voucherId, 6, "0");
                //}

                // Branch id
                doc.cpanel_branchId = currentBranch;

                return doc;
            }
        },
        onSuccess: function (formType, result) {
            //clearSelect2();
            alertify.payment().close();
            alertify.success('Success');

            // Print invoice
            if (state.get('submitType') == 'savePrint') {
                var params = {};
                var queryParams = {id: result};
                var path = FlowRouter.path("school.paymentInvoiceReportGen", params, queryParams);

                window.open(path, '_blank');
            }
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});
