var indexTpl = Template.school_staff,
    insertTpl = Template.school_staffInsert,
    updateTpl = Template.school_staffUpdate,
    showTpl = Template.school_staffShow;

// Index
indexTpl.onCreated(function () {
    // SEO
    SEO.set({
        title: 'Staff',
        description: 'Description for this page'
    });

    createNewAlertify('staff');
});
indexTpl.onRendered(function () {
});

indexTpl.helpers({
    selector: function () {
        return {cpanel_branchId: Session.get('currentBranch')};
    }
});

indexTpl.events({
    'click .insert': function (e, t) {
        alertify.staff(fa("plus", "Staff"), renderTemplate(insertTpl))
            .maximize();
    },
    'click .update': function (e, t) {
        var data = School.Collection.Staff.findOne(this._id);

        alertify.staff(fa("pencil", "Staff"), renderTemplate(Template.school_staffUpdate, data))
            .maximize();
    },
    'click .remove': function (e, t) {
        var self = this;

        alertify.confirm(
            fa("remove", "Staff"),
            "Are you sure to delete [" + self._id + "]?",
            function () {
                School.Collection.Staff.remove(self._id, function (error) {
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
        var data = School.Collection.Staff.findOne({_id: this._id});
        data.photoUrl = null;

        if (!_.isUndefined(data.photo)) {
            data.photoUrl = Files.findOne(data.photo).url();
        }

        alertify.alert(fa("eye", "Staff"), renderTemplate(showTpl, data).html);
    }
});

// Insert
insertTpl.onRendered(function () {
    configDate();
});

// Update
updateTpl.onRendered(function () {
    configDate();
});

// Hook
AutoForm.hooks({
    school_staffInsert: {
        before: {
            insert: function (doc) {
                var prefix = Session.get('currentBranch') + '-';
                doc._id = idGenerator.genWithPrefix(School.Collection.Staff, prefix, 3);
                doc.cpanel_branchId = Session.get('currentBranch');
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
    school_staffUpdate: {
        docToForm: function (doc, ss) {
            doc.dob = moment(doc.dob).format('YYYY-MM-DD');
            return doc;
        },
        onSuccess: function (formType, result) {
            alertify.staff().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

// Config date picker
var configDate = function () {
    var dob = $('[name="dob"]');
    DateTimePicker.date(dob);
};