/**
 * Declare template
 */
var indexTpl = Template.school_saleItem;
var insertTpl = Template.school_saleItemInsert;
var updateTpl = Template.school_saleItemUpdate;
var showTpl = Template.school_saleItemShow;
//add on
var addOnInsert = Template.school_saleCategoryInsert;
var addOnUpdate = Template.school_saleCategoryUpdate;

/**
 * State
 */
var state = new ReactiveObj({
    currency: '',
    exchange: '',
    fromAmount: 0
});

/**
 * Index
 */
indexTpl.onRendered(function () {
    // SEO
    SEO.set({
        title: 'Sale Item',
        description: 'Description for this page'
    });

    // Create new  alertify
    createNewAlertify(['saleItem'], {size: 'lg'});
    createNewAlertify(['saleCategory']);
});

indexTpl.events({
    'click .insert': function (e, t) {
        alertify.saleItem(fa("plus", "Sale Item"), renderTemplate(insertTpl));
    },
    'click .update': function (e, t) {
        var data = School.Collection.SaleItem.findOne(this._id);

        alertify.saleItem(fa("pencil", "Sale Item"), renderTemplate(updateTpl, data));
    },
    'click .remove': function (e, t) {
        var self = this;

        alertify.confirm(
            fa("remove", "Sale Item"),
            "Are you sure to delete [" + self._id + "]?",
            function () {
                School.Collection.SaleItem.remove(self._id, function (error) {
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
        var data = School.Collection.SaleItem.findOne({_id: this._id});

        alertify.alert(fa("eye", "Sale Item"), renderTemplate(showTpl, data).html);
    }
});

/**
 * Insert
 */
insertTpl.onRendered(function () {
    configOnRendered();
});

insertTpl.helpers({
    price: function () {
        var priceVal = 0, fromAmountVal;

        fromAmountVal = state.get('fromAmount');

        // Exchange
        var currency = state.get('currency');
        var exchange = state.get('exchange');
        if (!_.isEmpty(currency) && !_.isEmpty(exchange)) {
            var exchangeDoc = Cpanel.Collection.Exchange.findOne(exchange);
            fx.base = exchangeDoc.base;
            fx.rates = exchangeDoc.rates;

            priceVal = fx.convert(fromAmountVal, {from: currency, to: "USD"});
            priceVal = math.round(priceVal, 2);
        }

        return priceVal;
    }
});

insertTpl.events({
    'change [name="currencyId"]': function (e) {
        var currency = $(e.currentTarget).val();
        state.set('currency', currency);
    },
    'change [name="exchangeId"]': function (e) {
        state.set('exchange', $(e.currentTarget).val());
    },
    'keyup [name="fromAmount"]': function (e, t) {
        var fromAmount = parseFloat(t.$('[name="fromAmount"]').val());
        if (_.isNaN(fromAmount)) {
            fromAmount = 0;
        }
        state.set('fromAmount', fromAmount);
    },
    'click .saleCategoryInsertAddon': function (e, t) {
        alertify.saleCategory(fa("plus", "Sale Category"), renderTemplate(addOnInsert));
    }
});

/**
 * Update
 */
updateTpl.onCreated(function () {
    var updateData = Template.currentData();
    state.set('currency', updateData.currencyId);
    state.set('exchange', updateData.exchangeId);
    state.set('fromAmount', updateData.fromAmount);
});

updateTpl.helpers({
    price: function () {
        var priceVal = 0, fromAmountVal;

        fromAmountVal = state.get('fromAmount');

        // Exchange
        var currency = state.get('currency');
        var exchange = state.get('exchange');
        if (!_.isEmpty(currency) && !_.isEmpty(exchange)) {
            var exchangeDoc = Cpanel.Collection.Exchange.findOne(exchange);
            fx.base = exchangeDoc.base;
            fx.rates = exchangeDoc.rates;

            priceVal = fx.convert(fromAmountVal, {from: currency, to: "USD"});
            priceVal = math.round(priceVal, 2);
        }

        return priceVal;
    }
});

updateTpl.events({
    'change [name="currencyId"]': function (e) {
        var currency = $(e.currentTarget).val();
        state.set('currency', currency);
    },
    'change [name="exchangeId"]': function (e) {
        state.set('exchange', $(e.currentTarget).val());
    },
    'keyup [name="fromAmount"]': function (e, t) {
        var fromAmount = parseFloat(t.$('[name="fromAmount"]').val());
        if (_.isNaN(fromAmount)) {
            fromAmount = 0;
        }
        state.set('fromAmount', fromAmount);
    },
    'click .saleCategoryInsertAddon': function (e, t) {
        alertify.saleCategory(fa("plus", "Sale Category"), renderTemplate(addOnUpdate));
    }
});

updateTpl.onRendered(function () {
    configOnRendered();
});

/**
 * Hook
 */
AutoForm.hooks({
    school_saleItemInsert: {
        before: {
            insert: function (doc) {
                doc._id = idGenerator.genWithPrefix(School.Collection.SaleItem, doc.saleCategoryId, 3);
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            clearSelect2();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    school_saleItemUpdate: {
        onSuccess: function (formType, result) {
            alertify.saleItem().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

var configOnRendered = function () {
    Inputmask.currency([$('[name="price"]')]);
    Inputmask.currency([$('[name="fromAmount"]')], {prefix: ''});
};