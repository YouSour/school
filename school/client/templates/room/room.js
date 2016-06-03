var indexTpl = Template.school_room;
var insertTpl = Template.school_roomInsert;
var updateTpl = Template.school_roomUpdate;
var showTpl = Template.school_roomShow;

// Index
indexTpl.onCreated(function () {
    // SEO
    SEO.set({
        title: 'Room',
        description: 'Description for this page'
    });

    createNewAlertify('room');
});

indexTpl.helpers({
    selector: function () {
        return {cpanel_branchId: Session.get('currentBranch')};
    }
});

indexTpl.events({
    'click .insert': function (e, t) {
        alertify.room(fa("plus", "Room"), renderTemplate(insertTpl));
    },
    'click .update': function (e, t) {
        var data = School.Collection.Room.findOne(this._id);

        alertify.room(fa("pencil", "Room"), renderTemplate(updateTpl, data));
    },
    'click .remove': function (e, t) {
        var self = this;

        alertify.confirm(
            fa("remove", "Room"),
            "Are you sure to delete [" + self._id + "]?",
            function () {
                School.Collection.Room.remove(self._id, function (error) {
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
        alertify.alert(fa("eye", "Room"), renderTemplate(showTpl, this).html);
    }
});

// Insert
insertTpl.onRendered(function () {
    configOnRendered();
});

// Update
updateTpl.onRendered(function () {
    configOnRendered();
});

// Hook
AutoForm.hooks({
    school_roomInsert: {
        formToDoc: function (doc) {
            doc.cpanel_branchId = Session.get('currentBranch');
            return doc;
        },
        before: {
            insert: function (doc) {
                var currentBranch = Session.get('currentBranch');
                doc._id = idGenerator.genWithPrefix(School.Collection.Room, currentBranch + '-', 3);
                doc.cpanel_branchId = currentBranch;
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    school_roomUpdate: {
        onSuccess: function (formType, result) {
            alertify.room().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

/**
 * Config
 */
var configOnRendered = function () {
    Inputmask.integer($('[name="number"]'));
};
