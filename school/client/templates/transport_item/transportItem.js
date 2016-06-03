/**
 * Declare template
 */
var indexTpl = Template.school_transportItem,
    insertTpl = Template.school_transportItemInsert,
    updateTpl = Template.school_transportItemUpdate,
    showTpl = Template.school_transportItemShow,
    customArrayFieldForTransportItemTpl = Template.afArrayField_customArrayFieldForTransportItem;

/**
 * Index
 */
indexTpl.onCreated(function () {
    // SEO
    SEO.set({
        title: 'Transport Item',
        description: 'Description for this page'
    });

    createNewAlertify(['transportItem'], {size: 'lg'});
});

indexTpl.events({
    'click .insert': function (e, t) {
        alertify.transportItem(fa("plus", "Transport Item"), renderTemplate(insertTpl))
            .maximize();
    },
    'click .update': function (e, t) {
        var data = School.Collection.TransportItem.findOne(this._id);
        alertify.transportItem(fa("pencil", "Transport Item"), renderTemplate(updateTpl, data))
            .maximize();
    },
    'click .remove': function (e, t) {
        var self = this;

        alertify.confirm(
            fa("remove", "Transport Item"),
            "Are you sure to delete [" + self._id + "]?",
            function () {
                School.Collection.TransportItem.remove(self._id, function (error) {
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
        var data = School.Collection.TransportItem.findOne({_id: this._id});
        data.paymentMethodVal = JSON.stringify(data.paymentMethod, null, ' ');

        alertify.alert(fa("eye", "Transport Item"), renderTemplate(showTpl, data).html);
    }
});

/**
 * Insert
 */
insertTpl.onRendered(function () {
    configOnRendered();
});

insertTpl.events({});

/**
 * Update
 */
updateTpl.onRendered(function () {
    configOnRendered();
});

updateTpl.events({});

/**
 * Show
 */
showTpl.helpers({});

// Hook
AutoForm.hooks({
    school_transportItemInsert: {
        before: {
            insert: function (doc) {
                doc._id = idGenerator.gen(School.Collection.TransportItem, 3);
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            clearSelectize();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    school_transportItemUpdate: {
        onSuccess: function (formType, result) {
            alertify.transportItem().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

// Custom array field for transport item
customArrayFieldForTransportItemTpl.events({
    'blur .autoform-add-item': function (e, t) {
        configOnRendered();
    }
});

/**
 * Config
 */
var configOnRendered = function () {
    Inputmask.currency([$('.single'), $('.twice'), $('.threeTimes'), $('.fourTimes')])
};