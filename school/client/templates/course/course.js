var indexTpl = Template.school_course,
    insertTpl = Template.school_courseInsert,
    updateTpl = Template.school_courseUpdate,
    showTpl = Template.school_courseShow,
    departmentAddonTpl = Template.school_departmentInsert,
    customArrayFieldForPaymentMethodTpl = Template.afArrayField_customArrayFieldForPaymentMethod;

/**
 * State
 */
var state = new ReactiveObj({
    totalTerm: 0,
    baseAmount: 0
});

// Index
indexTpl.onCreated(function () {
    // SEO
    SEO.set({
        title: 'Course',
        description: 'Description for this page'
    });

    createNewAlertify(['course'], {size: 'lg'});
    createNewAlertify(['department']);
});

indexTpl.events({
    'click .insert': function (e, t) {
        alertify.course(fa("plus", "Course"), renderTemplate(insertTpl))
            .maximize();
    },
    'click .update': function (e, t) {
        var data = School.Collection.Course.findOne(this._id);
        state.set('totalTerm', data.term);
        state.set('baseAmount', data.baseAmount);
        School.ListState.set(['course', 'term'], data.term);

        alertify.course(fa("pencil", "Course"), renderTemplate(updateTpl, data))
            .maximize();
    },
    'click .remove': function (e, t) {
        var self = this;

        alertify.confirm(
            fa("remove", "Course"),
            "Are you sure to delete [" + self._id + "]?",
            function () {
                School.Collection.Course.remove(self._id, function (error) {
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
        var data = School.Collection.Course.findOne({_id: this._id});
        data.paymentMethodVal = JSON.stringify(data.paymentMethod, null, ' ');

        alertify.alert(fa("eye", "Course"), renderTemplate(showTpl, data).html);
    }
});

// Insert
insertTpl.onRendered(function () {
    configOnRendered();
});

insertTpl.events({
    'click .departmentInsertAddon': function (e, t) {
        alertify.department(fa("plus", "Department"), renderTemplate(departmentAddonTpl));
    },
    'keyup [name="term"]': function (e, t) {
        var term = $(e.currentTarget).val();
        state.set('totalTerm', term);
        School.ListState.set(['course', 'term'], term)
    },
    'keyup [name="baseAmount"]': function (e, t) {
        var baseAmount = $(e.currentTarget).val();
        state.set('baseAmount', baseAmount);
    }
});

// Update
updateTpl.onRendered(function () {
    configOnRendered();
});

updateTpl.events({
    'click .departmentInsertAddon': function (e, t) {
        alertify.department(fa("plus", "Department"), renderTemplate(departmentAddonTpl));
    },
    'keyup [name="term"]': function (e, t) {
        var term = $(e.currentTarget).val();
        state.set('totalTerm', term);
        School.ListState.set(['course', 'term'], term)
    },
    'keyup [name="baseAmount"]': function (e, t) {
        var baseAmount = $(e.currentTarget).val();
        state.set('baseAmount', baseAmount);
    }
});

// Hook
AutoForm.hooks({
    school_courseInsert: {
        before: {
            insert: function (doc) {
                doc._id = idGenerator.gen(School.Collection.Course, 6);
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            clearSelect2();
            clearSelectize();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    school_courseUpdate: {
        onSuccess: function (formType, result) {
            alertify.course().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

// Custom array field for payment method
customArrayFieldForPaymentMethodTpl.helpers({});
customArrayFieldForPaymentMethodTpl.events({
    'blur .autoform-add-item': function (e, t) {
        configOnRendered();
    },
    'change .jsPaymentMethodTerm': function (e, t) {
        var thisObj = $(e.currentTarget);
        var term = thisObj.val();
        var totalTerm = state.get('totalTerm');
        var baseAmount = state.get('baseAmount');

        var cost = term * baseAmount;
        var discount = thisObj.parents('div.jsPaymentMethod').find('.jsDiscount').val();
        var amount = cost - discount;

        thisObj.parents('div.jsPaymentMethod').find('.jsCost').val(cost);
        thisObj.parents('div.jsPaymentMethod').find('.jsAmount').val(amount);
    },
    'keyup .jsDiscount': function (e, t) {
        var thisObj = $(e.currentTarget);
        var discount = thisObj.val();
        var totalTerm = state.get('totalTerm');
        var baseAmount = state.get('baseAmount');

        var cost = thisObj.parents('div.jsPaymentMethod').find('.jsCost').val();
        var amount = cost - discount;

        thisObj.parents('div.jsPaymentMethod').find('.jsAmount').val(amount);
    }
});

customArrayFieldForPaymentMethodTpl.onDestroyed(function () {
    console.log('custom is destroyed');
    state.set([], {});
    School.ListState.set(['course', 'term'], 0);
});

/**
 * Config on rendered
 */
var configOnRendered = function () {
    Inputmask.integer($('[name="term"]'));
    Inputmask.currency([$('[name="baseAmount"]'), $('.jsCost'), $('.jsDiscount'), $('.jsAmount')]);
};
