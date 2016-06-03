var indexTpl = Template.school_teacher,
    insertTpl = Template.school_teacherInsert,
    updateTpl = Template.school_teacherUpdate,
    showTpl = Template.school_teacherShow;

// Index
indexTpl.onCreated(function () {
    // SEO
    SEO.set({
        title: 'Teacher',
        description: 'Description for this page'
    });

    createNewAlertify('teacher');
});

indexTpl.helpers({
    selector: function () {
        return {cpanel_branchId: Session.get('currentBranch')};
    }
});

indexTpl.events({
    'click .insert': function (e, t) {
        alertify.teacher(fa("plus", "Teacher"), renderTemplate(insertTpl))
            .maximize();
    },
    'click .update': function (e, t) {
        var data = School.Collection.Teacher.findOne(this._id);

        alertify.teacher(fa("pencil", "Teacher"), renderTemplate(updateTpl, data))
            .maximize();
    },
    'click .remove': function (e, t) {
        var self = this;

        alertify.confirm(
            fa("remove", "Teacher"),
            "Are you sure to delete [" + self._id + "]?",
            function () {
                School.Collection.Teacher.remove(self._id, function (error) {
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
        var data = School.Collection.Teacher.findOne({_id: this._id});
        data.photoUrl = null;

        if (!_.isUndefined(data.photo)) {
            data.photoUrl = Files.findOne(data.photo).url();
        }

        alertify.alert(fa("eye", "Teacher"), renderTemplate(showTpl, data).html);
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
    school_teacherInsert: {
        before: {
            insert: function (doc) {
                var prefix = Session.get('currentBranch') + '-';
                doc._id = idGenerator.genWithPrefix(School.Collection.Teacher, prefix, 3);
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
    school_teacherUpdate: {
        docToForm: function (doc, ss) {
            doc.dob = moment(doc.dob).format('YYYY-MM-DD');
            return doc;
        },
        onSuccess: function (formType, result) {
            alertify.teacher().close();
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
