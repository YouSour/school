/***** Declare template */
var indexTpl = Template.school_student,
    insertTpl = Template.school_studentInsert,
    updateTpl = Template.school_studentUpdate,
    showTpl = Template.school_studentShow,

    registerActionTpl = Template.school_register;

/***** Declare state*/
School.studentState = new ReactiveObj();

// Index
indexTpl.onCreated(function () {
    // SEO
    SEO.set({
        title: 'Student',
        description: 'Description for this page'
    });

    createNewAlertify(['student'], {size: 'lg'});
});

indexTpl.helpers({
    selector: function () {
        return {cpanel_branchId: Session.get('currentBranch')}
    }
});

indexTpl.events({
    'click .insert': function (e, t) {
        alertify.student(fa("plus", "Student"), renderTemplate(insertTpl))
            .maximize();
    },
    'click .update': function (e, t) {
        var data = School.Collection.Student.findOne(this._id);
        data.dob = moment(data.dob).format('YYYY-MM-DD');

        alertify.student(fa("pencil", "Student"), renderTemplate(updateTpl, data))
            .maximize();
    },
    'click .remove': function (e, t) {
        var self = this;

        alertify.confirm(
            fa("remove", "Student"),
            "Are you sure to delete [" + self._id + "]?",
            function () {
                School.Collection.Student.remove(self._id, function (error) {
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
        alertify.alert(fa("eye", "Student"), renderTemplate(showTpl, this).html);
    },
    'click .actionRegister': function (e, t) {
        var self = this;
        FlowRouter.go('school.register', {studentId: self._id});
    },
    'click .actionTransport': function (e, t) {
        var self = this;
        FlowRouter.go('school.transport', {studentId: self._id});
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

// Show
showTpl.helpers({
    data: function () {
        var self = this;
        var data = School.Collection.Student.findOne(self._id);
        data.emergencyVal = s.humanize(JSON.stringify(data.emergency));
        data.familyVal = s.humanize(JSON.stringify(data.family));
        data.photoUrl = null;

        if (!_.isUndefined(data.photo)) {
            data.photoUrl = Files.findOne(data.photo).url();
        }

        return data;
    }
});

// Hook
AutoForm.hooks({
    school_studentInsert: {
        before: {
            insert: function (doc) {
                var currentBranch = Session.get('currentBranch');
                doc._id = idGenerator.genWithPrefix(School.Collection.Student, currentBranch + '-', 6);
                doc.cpanel_branchId = currentBranch;
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            clearSelect2();
            alertify.success('Success');
        },
        after: {
            insert: function () {
                $('select[name="gender"]').select2();
                $('select[name="nationality"]').select2();
            }
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    school_studentUpdate: {
        onSuccess: function (formType, result) {
            alertify.student().close();
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
