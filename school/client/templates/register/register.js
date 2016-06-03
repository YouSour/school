/*********** Declare temple **********/
var indexTpl = Template.school_register,
    insertTpl = Template.school_registerInsert,
    updateTpl = Template.school_registerUpdate,
    showTpl = Template.school_registerShow,

    studentShowTpl = Template.school_studentShow,
    studentInsertAddonTpl = Template.school_studentInsert,
    classInsertAddonTpl = Template.school_classInsert;

// Index
indexTpl.onCreated(function () {
    // SEO
    SEO.set({
        title: 'Register',
        description: 'Description for this page'
    });

    // Create new  alertify
    createNewAlertify(['register']);
    createNewAlertify(['class'], {size: 'lg'});
});

indexTpl.helpers({
    selector: function () {
        var studentId = FlowRouter.getParam('studentId');
        return {studentId: studentId};
    },
    student: function () {
        var studentId = FlowRouter.getParam('studentId');
        var studentDoc = School.Collection.Student.findOne(studentId);
        studentDoc.photoUrl = null;

        if (!_.isUndefined(studentDoc.photo)) {
            studentDoc.photoUrl = Files.findOne(studentDoc.photo).url();
        }

        return studentDoc;
    }
});

indexTpl.events({
    'click .jsStudentInfo': function (e, t) {
        alertify.alert(fa("eye", "Student"), renderTemplate(studentShowTpl, this).html);
    },
    'click .insert': function (e, t) {
        alertify.register(fa("plus", "Register"), renderTemplate(insertTpl));
    },
    'click .update': function (e, t) {
        var data = School.Collection.Register.findOne(this._id);
        data.registerDate = moment(data.registerDate).format('YYYY-MM-DD');

        alertify.register(fa("pencil", "Register"), renderTemplate(updateTpl, data));
    },
    'click .remove': function (e, t) {
        var self = this;

        alertify.confirm(
            fa("remove", "Student Class"),
            "Are you sure to delete [" + self._id + "]?",
            function () {
                School.Collection.Register.remove(self._id, function (error) {
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
        alertify.alert(fa("eye", "Register"), renderTemplate(showTpl, this).html);
    },
    'click .actionStatus': function (e, t) {
        var studentId = FlowRouter.getParam('studentId');
        var registerId = this._id;

        FlowRouter.go('school.registerStatus', {studentId: studentId, registerId: registerId});
    },
    'click .actionPayment': function (e, t) {
        var studentId = FlowRouter.getParam('studentId');
        var registerId = this._id;

        FlowRouter.go('school.payment', {studentId: studentId, registerId: registerId});
    },
    'click .printApplicationForm': function () {
        var params = {};
        var queryParams = {id: this._id};
        var path = FlowRouter.path("school.registerFormReportGen", params, queryParams);

        window.open(path, '_blank');
    }
});

// Insert
insertTpl.onRendered(function () {
    // config date picker
    configOnRendered();
});

insertTpl.helpers({
    studentId: function () {
        return FlowRouter.getParam('studentId');
    }
});

insertTpl.events({
    'change [name="courseId"]': function (e, t) {
        var courseId = t.$('[name="courseId"]').val();

        // Set list state of register form
        School.ListState.set(['register', 'courseId'], courseId);

        Meteor.setTimeout(function () {
            clearSelect2($('[name="classId"]'));
            //clearSelect2([$('[name="defaultPaymentMethod"]'), $('[name="classId"]')]);
        }, 100);
    },
    'click .classInsertAddon': function (e, t) {
        alertify.class(fa("plus", "Class"), renderTemplate(classInsertAddonTpl));
    }
});

// Update
updateTpl.onCreated(function () {
    var dataUpdate = Template.currentData();
    if (!_.isUndefined(dataUpdate)) {
        // Set list state of register form
        School.ListState.set(['register', 'courseId'], dataUpdate.courseId);
    }
});

updateTpl.onRendered(function () {
    configOnRendered();
});

updateTpl.events({
    'change [name="courseId"]': function (e, t) {
        var courseId = t.$('[name="courseId"]').val();

        // Set list state of register form
        School.ListState.set(['register', 'courseId'], courseId);

        if (_.isEmpty(courseId)) {
            Meteor.setTimeout(function () {
                clearSelect2($('[name="classId"]'));
                //clearSelect2([$('[name="defaultPaymentMethod"]'), $('[name="classId"]')]);
            }, 100);
        }
    },
    'click .classInsertAddon': function (e, t) {
        alertify.class(fa("plus", "Class"), renderTemplate(classInsertAddonTpl));
    }
});

// Show
showTpl.helpers({
    data: function () {
        var self = this;
        var data = School.Collection.Register.findOne(self._id);
        var paymentMethod = data._class._course.paymentMethod;

        var paymentM = '<ul>';
        paymentMethod.forEach(function (data) {
            if (data != null) {
                paymentM += "<li>" +
                    data.term + ' Month(s) = ' + numeral(data.amount).format('0,000.00') +
                    "</li>";
            }
        });
        paymentM += '</ul>';
        data.paymentMethodF = Spacebars.SafeString(paymentM);

        // Status
        data.statusObj = {};
        if (data._statusBack && !_.isEmpty(data._statusBack)) {
            var lastStatus = _.chain(data._statusBack)
                .sortBy('_id')
                .last()
                .value();
            data.statusObj = lastStatus;
        }

        return data;
    }
});

// Hook
AutoForm.hooks({
    school_registerInsert: {
        before: {
            insert: function (doc) {
                var currentBranch = Session.get('currentBranch');
                var preId = doc.studentId;

                doc._id = idGenerator.genWithPrefix(School.Collection.Register, preId, 3);

                // Check new/old
                doc.newOld = 'N';
                var checkOldNew = School.Collection.Register.findOne({studentId: doc.studentId});
                if (!_.isUndefined(checkOldNew)) {
                    doc.newOld = 'O';
                }

                // Branch
                doc.cpanel_branchId = currentBranch;

                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.register().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    school_registerUpdate: {
        onSuccess: function (formType, result) {
            alertify.register().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

// Config on rendered
var configOnRendered = function () {
    var registerDate = $('[name="registerDate"]');
    DateTimePicker.date([registerDate]);
};