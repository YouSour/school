/************* Declare template ***************/
var indexTpl = Template.school_registerStatus,
    insertTpl = Template.school_registerStatusInsert,
    updateTpl = Template.school_registerStatusUpdate,

    registerShowTpl = Template.school_registerShow;
//showTpl = Template.school_registerStatusShow;

// State
var state = new ReactiveObj({
    statusDate: ''
});

// Index
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

indexTpl.onCreated(function () {
    // SEO
    SEO.set({
        title: 'Register Status',
        description: 'Description for this page'
    });

    createNewAlertify('registerStatus');
});

indexTpl.events({
    'click .jsRegisterInfo': function (e, t) {
        alertify.alert(fa("eye", "Register"), renderTemplate(registerShowTpl, this).html);
    },
    'click .insert': function (e, t) {
        alertify.registerStatus(fa("plus", "Register Status"), renderTemplate(insertTpl));
    },
    'click .update': function (e, t) {
        var data = School.Collection.RegisterStatus.findOne(this._id);
        data.statusDate = moment(data.statusDate).format('YYYY-MM-DD');

        alertify.registerStatus(fa("pencil", "Register Status"), renderTemplate(updateTpl, data));
    },
    'click .remove': function (e, t) {
        var self = this;

        alertify.confirm(
            fa("remove", "Register Status"),
            "Are you sure to delete [" + self._id + "]?",
            function () {
                School.Collection.RegisterStatus.remove(self._id, function (error) {
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
    //'click .show': function (e, t) {
    //    var data = School.Collection.RegisterStatus.findOne(this._id);
    //    data.statusDate = moment(data.statusDate).format('YYYY-MM-DD');
    //
    //    alertify.alert(fa("eye", "Register Status"), renderTemplate(showTpl, data));
    //}
});

// Insert
insertTpl.onRendered(function () {
    configOnRendered();
});

insertTpl.helpers({
    registerId: function () {
        return FlowRouter.getParam('registerId');
    },
    statusDate: function () {
        return state.get('statusDate');
    }
});

insertTpl.events({});

// Update
updateTpl.onRendered(function () {
    configOnRendered();
});
updateTpl.events({});

// Hook
AutoForm.hooks({
    school_registerStatusInsert: {
        before: {
            insert: function (doc) {
                var currentBranch = Session.get('currentBranch');
                doc._id = idGenerator.genWithPrefix(School.Collection.RegisterStatus, doc.registerId, 3);
                doc.cpanel_branchId = currentBranch;

                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.registerStatus().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    school_registerStatusUpdate: {
        onSuccess: function (formType, result) {
            alertify.registerStatus().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

// Config on rendered
var configOnRendered = function () {
    var statusDate = $('[name="statusDate"]');
    DateTimePicker.date(statusDate);

    /*** Config min date for status date ***/
    var registerId = FlowRouter.getParam('registerId');
    var registerDoc = School.Collection.Register.findOne(registerId);
    var minStatusDate = registerDoc.registerDate;

    // Get last status
    var dataUpdate = Template.currentData();
    var selectorOfLastStatus = {};
    selectorOfLastStatus.registerId = registerId;
    if (!_.isUndefined(dataUpdate)) {
        selectorOfLastStatus._id = {$ne: dataUpdate._id};
    }

    var lastStatus = School.Collection.RegisterStatus.findOne(selectorOfLastStatus, {sort: {_id: -1}});
    if (!_.isUndefined(lastStatus)) {
        minStatusDate = lastStatus.statusDate;
    }
    minStatusDate = moment(minStatusDate).add(1, 'days').toDate();
    minStatusDate = moment(minStatusDate).format('YYYY-MM-DD');
    state.set('statusDate', minStatusDate);
    statusDate.data("DateTimePicker").minDate(minStatusDate);
};