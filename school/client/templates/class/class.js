/************ Declare temple ***************/
var indexTpl = Template.school_class,
    insertTpl = Template.school_classInsert,
    updateTpl = Template.school_classUpdate,
    showTpl = Template.school_classShow,

    updateStatusTpl = Template.school_classUpdateStatus,
    actionStatusTpl = Template.school_classActionStatus,
    roomInsertAddonTpl = Template.school_roomInsert;

/************ Declare reactive obj ***************/
var state = new ReactiveObj({
    startDate: '',
    courseTerm: 0
});

// Index
indexTpl.onCreated(function () {
    // SEO
    SEO.set({
        title: 'Class',
        description: 'Description for this page'
    });

    createNewAlertify(['class', 'room'], {size: 'lg'});
    createNewAlertify(['classUpdateStatus']);
});

indexTpl.helpers({
    selector: function () {
        return {cpanel_branchId: Session.get('currentBranch')};
    }
});

indexTpl.events({
    'click .insert': function (e, t) {
        alertify.class(fa("plus", "Class"), renderTemplate(insertTpl));
    },
    'click .update': function (e, t) {
        var data = School.Collection.Class.findOne(this._id);
        data.startDate = moment(data.startDate).format('YYYY-MM-DD');

        alertify.class(fa("pencil", "Class"), renderTemplate(updateTpl, data));
    },
    'click .remove': function (e, t) {
        var self = this;

        alertify.confirm(
            fa("remove", "Class"),
            "Are you sure to delete [" + self._id + "]?",
            function () {
                School.Collection.Class.remove(self._id, function (error) {
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
        var data = School.Collection.Class.findOne({_id: this._id});
        data.statusVal = JSON.stringify(data.status, null, ' ');

        alertify.alert(fa("eye", "Class"), renderTemplate(showTpl, data).html);
    },
    'click .actionStatus': function (e, t) {
        var data = School.Collection.Class.findOne(this._id);
        if (data.status == 'Active') {
            data.status = 'Close';
        } else {
            data.status = 'Active';
        }
        data.statusDate = moment(data.statusDate).format('YYYY-MM-DD');

        alertify.classUpdateStatus(fa("pencil", "Class Status"), renderTemplate(updateStatusTpl, data));
    }
});

// Insert
insertTpl.onRendered(function () {
    state.set('startDate', $('[name="startDate"]').val());
    configOnRendered();
});

insertTpl.helpers({
    endDate: function () {
        var endDate = '';
        var startDate = state.get('startDate');
        var courseTerm = state.get('courseTerm');

        if (!_.isEmpty(startDate)) {
            endDate = moment(startDate).add(courseTerm, 'months').toDate();
            endDate = moment(endDate).format('YYYY-MM-DD');
        }

        return endDate;
    }
});

insertTpl.events({
    'change [name="courseId"]': function (e, t) {
        var courseId = t.$('[name="courseId"]').val();
        var courseDoc = School.Collection.Course.findOne(courseId);
        var name = $('[name="name"]');

        // Set new state
        if (!_.isUndefined(courseDoc)) {
            state.set('courseTerm', courseDoc.term);
            name.val(courseDoc.name);
        } else {
            state.set('courseTerm', 0);
            name.val('');
        }
    },
    'click .roomInsertAddon': function (e, t) {
        alertify.room(fa("plus", "Room"), renderTemplate(roomInsertAddonTpl));
    }
});

// Update
updateTpl.onRendered(function () {
    var self = Template.currentData();
    // Set new state
    state.set('startDate', self.startDate);
    state.set('courseTerm', self._course.term);

    configOnRendered();
});

updateTpl.helpers({
    endDate: function () {
        var endDate = '';
        var startDate = state.get('startDate');
        var courseTerm = state.get('courseTerm');

        if (!_.isEmpty(startDate)) {
            endDate = moment(startDate).add(courseTerm, 'months').toDate();
            endDate = moment(endDate).format('YYYY-MM-DD');
        }

        return endDate;
    }
});

updateTpl.events({
    'change [name="courseId"]': function (e, t) {
        var courseId = t.$('[name="courseId"]').val();
        var courseDoc = School.Collection.Course.findOne(courseId);
        var name = $('[name="name"]');

        // Set new state
        if (!_.isUndefined(courseDoc)) {
            state.set('courseTerm', courseDoc.term);
            name.val(courseDoc.name);
        } else {
            state.set('courseTerm', 0);
            name.val('');
        }
    },
    'click .roomInsertAddon': function (e, t) {
        alertify.room(fa("plus", "Room"), renderTemplate(roomInsertAddonTpl));
    }
});

// Status
actionStatusTpl.helpers({
    statusCss: function () {
        var cssClass = 'default';
        var cssTitle = moment(this.statusDate).format('YYYY-MM-DD');
        if (this.status == 'Close') {
            cssClass = 'danger';
        }

        return {cssClass: cssClass, cssTitle: cssTitle};
    }
});

updateStatusTpl.onRendered(function () {
    configOnRendered();
});

// Hook
AutoForm.hooks({
    school_classInsert: {
        before: {
            insert: function (doc) {
                var currentBranch = Session.get('currentBranch');
                doc._id = idGenerator.genWithPrefix(School.Collection.Class, currentBranch + '-', 6);
                doc.cpanel_branchId = currentBranch;
                doc.status = 'Active';
                doc.statusDate = doc.startDate;

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
    school_classUpdate: {
        before: {
            update: function (doc) {
                doc.$set.statusDate = doc.$set.startDate;
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.class().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    school_classUpdateStatus: {
        onSuccess: function (formType, result) {
            alertify.classUpdateStatus().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

// Config on rendered
var configOnRendered = function () {
    var startDate = $('[name="startDate"]');
    var statusDate = $('[name="statusDate"]');

    DateTimePicker.date([startDate, statusDate]);

    // On change
    startDate.on("dp.change", function (e) {
        // Set new state
        state.set('startDate', e.date);
    });
};
