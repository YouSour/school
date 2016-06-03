/**
 * Declare template
 */
var indexTpl = Template.school_sale,
    insertTpl = Template.school_saleInsert,
    updateTpl = Template.school_saleUpdate,
    showTpl = Template.school_saleShow,

    customerShowTpl = Template.school_saleCustomerShow,
    customArrayFieldSale = Template.afArrayField_customArrayFieldSale;

/**
 * Declare state
 */
var state = new ReactiveObj({
    exchange: {},
    saleDate: '',
    totalUsd: 0,
    submitType: 'save'
});


/**
 * Index
 */
indexTpl.onCreated(function () {
    // SEO
    SEO.set({
        title: 'Sale',
        description: 'Description for this page'
    });

    createNewAlertify(['sale']);
});

indexTpl.helpers({
    selector: function () {
        var customerId = FlowRouter.getParam('customerId');
        return {customerId: customerId};
    },
    customer: function () {
        var customerId = FlowRouter.getParam('customerId');
        var customerDoc = School.Collection.SaleCustomer.findOne(customerId);

        return customerDoc;
    }
});

indexTpl.events({
    'click .jsCustomerInfo': function (e, t) {
        alertify.alert(fa("eye", "Customer"), renderTemplate(customerShowTpl, this).html);
    },
    'click .insert': function () {
        alertify.sale(fa("plus", "Sale"), renderTemplate(insertTpl))
            .maximize();
    },
    'click .update': function (e, t) {
        var data = School.Collection.Sale.findOne(this._id);
        data.saleDate = moment(data.saleDate).format('YYYY-MM-DD');
        //data.voucherId = data.voucherId.slice(8);

        alertify.sale(fa("pencil", "Sale"), renderTemplate(updateTpl, data))
            .maximize();
    },
    'click .remove': function () {
        var self = this;

        alertify.confirm(
            fa("remove", "Sale"),
            "Are you sure to delete [" + self._id + "]?",
            function () {
                School.Collection.Sale.remove(self._id, function (error) {
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
    'click .show': function () {
        var data = School.Collection.Sale.findOne({_id: this._id});
        alertify.alert(fa("eye", "Sale"), renderTemplate(showTpl, data).html);
    },
    'click .printInvoice': function () {
        var params = {};
        var queryParams = {id: this._id};
        var path = FlowRouter.path("school.saleInvoiceReportGen", params, queryParams);

        window.open(path, '_blank');
    }
});

/**
 * Insert
 */
insertTpl.onRendered(function () {
    configOnRendered();
});

insertTpl.helpers({
    customerId: function () {
        return FlowRouter.getParam('customerId');
    },
    voucherId: function () {
        var currentBranch = Session.get('currentBranch');
        var saleDate = state.get('saleDate');
        var year = moment(saleDate).format("YYYY");
        var prefixVoucher = currentBranch + '-' + year;

        Fetcher.setDefault("voucherId", '');
        Fetcher.retrieve('voucherId', 'school_saleVoucherId', prefixVoucher);

        return Fetcher.get('voucherId');
    }
});

insertTpl.events({
    'change [name="exchangeId"]': function (e) {
        var exchange = Cpanel.Collection.Exchange.findOne($(e.currentTarget).val());
        state.set('exchange', exchange);
    },
    'change .itemId': function (e) {
        var thisObj = $(e.currentTarget);
        var itemId = thisObj.val();

        if (itemId != "") {
            var dataItemId = School.Collection.SaleItem.findOne({_id: itemId});
            var price = dataItemId.price;
            thisObj.parents('div.row').find('.price').val(price);
            thisObj.parents('div.row').find('.qty').val(1);
            thisObj.parents('div.row').find('.discount').val(0);
            thisObj.parents('div.row').find('.amount').val(price);

            //$('.btnAdd').removeAttr('disabled');
        } else {
            //$('.btnAdd').attr('disabled', "disabled");
        }

        // Cal total
        calculateTotal();
    },
    'click .btnRemove': function (e) {
        setTimeout(function () {
            //var enable = true;
            //$('.amount').each(function () {
            //    var amount = $(this).val() == "" ? 0 : parseFloat($(this).val());
            //    if (amount == 0) {
            //        enable = false;
            //        return false;
            //    }
            //    enable = true;
            //});
            //
            //if (enable) {
            //    $('.btnAdd').attr('disabled', false);
            //} else {
            //    $('.btnAdd').attr('disabled', true);
            //}

            calculateTotal();
        }, 300);

    },
    //'click .btnAdd': function (e) {
    //    var thisObj = $(e.currentTarget);
    //    var itemId = thisObj.parents('div.row').find('.itemId').val();
    //    var price = thisObj.parents('div.row').find('.price').val();
    //    var qty = thisObj.parents('div.row').find('.qty').val();
    //    var discount = thisObj.parents('div.row').find('.discount').val();
    //
    //    if (itemId != "" && qty != 0 && price != 0 && discount != 0) {
    //        $('.btnAdd').removeAttr('disabled');
    //    } else {
    //        $('.btnAdd').attr('disabled', "disabled");
    //    }
    //},
    'blur .btnAdd': function (e) {
        configOnRendered();
    },
    'keyup .price,.qty,.discount, click .price,.qty,.discount': function (e) {
        var thisObj = $(e.currentTarget);
        var price = thisObj.parents('div.row').find('.price').val();
        var qty = thisObj.parents('div.row').find('.qty').val();
        var amount = price * qty;
        var discount = thisObj.parents('div.row').find('.discount').val();
        thisObj.parents('div.row').find('.amount').val(amount - (amount * discount / 100));

        //if (price != 0 && qty != 0 && discount < 0) {
        //    $('.btnAdd').removeAttr('disabled');
        //} else {
        //    $('.btnAdd').attr('disabled', "disabled");
        //}

        // Cal total
        calculateTotal();
    },
    'click .save': function (e, t) {
        var submitType = e.currentTarget.id;
        // Set new submitType state
        state.set('submitType', submitType)
    }
});

/**
 * Update
 */
updateTpl.onRendered(function () {
    configOnRendered();
});

updateTpl.events({
    'change [name="exchangeId"]': function (e) {
        var exchange = Cpanel.Collection.Exchange.findOne($(e.currentTarget).val());
        state.set('exchange', exchange);
    },
    'change .itemId': function (e) {
        var thisObj = $(e.currentTarget);
        var itemId = thisObj.val();

        if (itemId != "") {
            var dataItemId = School.Collection.SaleItem.findOne({_id: itemId});
            var price = dataItemId.price;
            thisObj.parents('div.row').find('.price').val(price);
            thisObj.parents('div.row').find('.qty').val(1);
            thisObj.parents('div.row').find('.discount').val(0);
            thisObj.parents('div.row').find('.amount').val(price);

            //$('.btnAdd').removeAttr('disabled');
        } else {
            //$('.btnAdd').attr('disabled', "disabled");
        }

        // Cal total
        calculateTotal();
    },
    'click .btnRemove': function (e) {
        setTimeout(function () {
            //var enable = true;
            //$('.amount').each(function () {
            //    var amount = $(this).val() == "" ? 0 : parseFloat($(this).val());
            //    if (amount == 0) {
            //        enable = false;
            //        return false;
            //    }
            //    enable = true;
            //});
            //
            //if (enable) {
            //    $('.btnAdd').attr('disabled', false);
            //} else {
            //    $('.btnAdd').attr('disabled', true);
            //}

            calculateTotal();
        }, 300);

    },
    //'click .btnAdd': function (e) {
    //    var thisObj = $(e.currentTarget);
    //    var itemId = thisObj.parents('div.row').find('.itemId').val();
    //    var price = thisObj.parents('div.row').find('.price').val();
    //    var qty = thisObj.parents('div.row').find('.qty').val();
    //    var discount = thisObj.parents('div.row').find('.discount').val();
    //
    //    if (itemId != "" && qty != 0 && price != 0 && discount != 0) {
    //        $('.btnAdd').removeAttr('disabled');
    //    } else {
    //        $('.btnAdd').attr('disabled', "disabled");
    //    }
    //},
    'blur .btnAdd': function (e) {
        configOnRendered();
    },
    'keyup .price,.qty,.discount, click .price,.qty,.discount': function (e) {
        var thisObj = $(e.currentTarget);
        var price = thisObj.parents('div.row').find('.price').val();
        var qty = thisObj.parents('div.row').find('.qty').val();
        var amount = price * qty;
        var discount = thisObj.parents('div.row').find('.discount').val();
        thisObj.parents('div.row').find('.amount').val(amount - (amount * discount / 100));

        //if (price != 0 && qty != 0 && discount < 0) {
        //    $('.btnAdd').removeAttr('disabled');
        //} else {
        //    $('.btnAdd').attr('disabled', "disabled");
        //}

        // Cal total
        calculateTotal();
    },
    'click .save': function (e, t) {
        var submitType = e.currentTarget.id;
        // Set new submitType state
        state.set('submitType', submitType)
    }
});

/**
 * Custom array field
 */
customArrayFieldSale.helpers({
    totalConvert: function () {
        var totalKhr = 0, totalThb = 0;

        // Exchange
        var totalUsd = state.get('totalUsd');
        var exchange = state.get('exchange');
        if (!_.isEmpty(exchange)) {
            fx.base = exchange.base;
            fx.rates = exchange.rates;

            totalKhr = fx.convert(totalUsd, {from: "USD", to: "KHR"});
            totalKhr = numeral(roundKhr(totalKhr)).format('0,0.00');
            totalThb = fx.convert(totalUsd, {from: "USD", to: "THB"});
            totalThb = numeral(math.round(totalThb)).format('0,0.00');
        }

        return {totalKhr: totalKhr, totalThb: totalThb};
    }
});

/**
 * Hook
 */
AutoForm.hooks({
    school_saleInsert: {
        before: {
            insert: function (doc) {
                var currentBranch = Session.get('currentBranch');

                doc._id = idGenerator.genWithPrefix(School.Collection.Sale, doc.customerId, 9);

                // Voucher
                //if (!_.isEmpty(doc.voucherId)) {
                //    var date = moment(doc.transportDate).format("YYYY");
                //    var prefixVoucher = currentBranch + '-' + date;
                //    doc.voucherId = prefixVoucher + s.pad(doc.voucherId, 6, "0");
                //}

                doc.cpanel_branchId = currentBranch;
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            clearSelect2();
            clearSelectize();
            alertify.success("Success");

            // Print invoice
            if (state.get('submitType') == 'savePrint') {
                var params = {};
                var queryParams = {id: result};
                var path = FlowRouter.path("school.saleInvoiceReportGen", params, queryParams);

                window.open(path, '_blank');
            }
        },
        onError: function (fromType, error) {
            alertify.error(error.message);
        }
    },
    school_saleUpdate: {
        before: {
            update: function (doc) {
                var currentBranch = Session.get('currentBranch');

                // Voucher
                //if (!_.isEmpty(doc.$set.voucherId)) {
                //    var date = moment(doc.$set.transportDate).format("YYYY");
                //    var prefixVoucher = currentBranch + '-' + date;
                //    doc.$set.voucherId = prefixVoucher + s.pad(doc.$set.voucherId, 6, "0");
                //}

                return doc;
            }
        },
        onSuccess: function (formType, result) {
            var doc = this.currentDoc;
            alertify.sale().close();
            alertify.success('Success');

            // Print invoice
            if (state.get('submitType') == 'savePrint') {
                var params = {};
                var queryParams = {id: doc._id};
                var path = FlowRouter.path("school.saleInvoiceReportGen", params, queryParams);

                window.open(path, '_blank');
            }
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

/**
 * Config on rendered
 */
var configOnRendered = function () {
    var saleDate = $('[name="saleDate"]');
    state.set('saleDate', moment(saleDate).format('YYYY-MM-DD'));

    DateTimePicker.date(saleDate);

    Inputmask.integer($('.qty'));
    Inputmask.currency([$('.price'), $('.amount'), $('[name="totalAmount"]')]);
    Inputmask.percentage($('.discount'));

    // Check type
    var dataUpdate = Template.currentData();
    if (!_.isUndefined(dataUpdate)) {
        state.set('exchange', dataUpdate._exchange);
        state.set('totalUsd', dataUpdate.totalAmount);
    }

    /*** On change ***/
    saleDate.on("dp.change", function (e) {
        state.set('saleDate', moment(e.date).format('YYYY-MM-DD'));
    });
};

/**
 * Calculate all amount to total
 */
function calculateTotal() {
    var total = 0, totalKhr = 0, totalThb = 0;
    $('.amount').each(function () {
        var amount = $(this).val() == "" ? 0 : parseFloat($(this).val());
        total += amount;
    });

    $('[name="totalAmount"]').val(total);
    state.set('totalUsd', total);
}