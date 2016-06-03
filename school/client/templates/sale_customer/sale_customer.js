/***** Declare template */
var indexTpl = Template.school_saleCustomer,
    insertTpl = Template.school_saleCustomerInsert,
    updateTpl = Template.school_saleCustomerUpdate,
    showTpl = Template.school_saleCustomerShow,

    registerActionTpl = Template.school_register;

/***** Declare state*/
School.saleCustomerState = new ReactiveObj();

// Index
indexTpl.onCreated(function () {
    // SEO
    SEO.set({
        title: 'Sale Customer',
        description: 'Description for this page'
    });

    createNewAlertify(['saleCustomer']);
});

indexTpl.helpers({
    selector: function () {
        return {cpanel_branchId: Session.get('currentBranch')}
    }
});

indexTpl.events({
    'click .insert': function (e, t) {
        alertify.saleCustomer(fa("plus", "Sale Customer"), renderTemplate(insertTpl))
            .maximize();
    },
    'click .update': function (e, t) {
        var data = School.Collection.SaleCustomer.findOne(this._id);

        alertify.saleCustomer(fa("pencil", "Sale Customer"), renderTemplate(updateTpl, data))
            .maximize();
    },
    'click .remove': function (e, t) {
        var self = this;

        alertify.confirm(
            fa("remove", "Sale Customer"),
            "Are you sure to delete [" + self._id + "]?",
            function () {
                School.Collection.SaleCustomer.remove(self._id, function (error) {
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
        alertify.alert(fa("eye", "Sale Customer"), renderTemplate(showTpl, this).html);
    },
    'click .actionSale': function (e, t) {
        var self = this;
        FlowRouter.go('school.sale', {customerId: self._id});
    }
});

// Insert
insertTpl.onRendered(function () {
});

// Update
updateTpl.onRendered(function () {
});

// Show
showTpl.helpers({
    data: function () {
        var self = this;
        var data = School.Collection.SaleCustomer.findOne(self._id);
        return data;
    }
});

// Hook
AutoForm.hooks({
    school_saleCustomerInsert: {
        before: {
            insert: function (doc) {
                var currentBranch = Session.get('currentBranch');
                doc._id = idGenerator.genWithPrefix(School.Collection.SaleCustomer, currentBranch + '-', 6);
                doc.cpanel_branchId = currentBranch;
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
    school_saleCustomerUpdate: {
        onSuccess: function (formType, result) {
            alertify.saleCustomer().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});
