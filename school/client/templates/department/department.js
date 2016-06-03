var indexTpl = Template.school_department;
var insertTpl = Template.school_departmentInsert;
var updateTpl = Template.school_departmentUpdate;
var showTpl = Template.school_departmentShow;

// Index
indexTpl.onCreated(function () {
    // SEO
    SEO.set({
        title: 'Department',
        description: 'Description for this page'
    });

    createNewAlertify('department');
});
indexTpl.events({
    'click .insert': function (e, t) {
        alertify.department(fa("plus", "Department"), renderTemplate(insertTpl));
    },
    'click .update': function (e, t) {
        var data = School.Collection.Department.findOne(this._id);
        alertify.department(fa("pencil", "Department"), renderTemplate(updateTpl, data));
    },
    'click .remove': function (e, t) {
        var self = this;

        alertify.confirm(
            fa("remove", "Department"),
            "Are you sure to delete [" + self._id + "]?",
            function () {
                School.Collection.Department.remove(self._id, function (error) {
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
        alertify.alert(fa("eye", "Department"), renderTemplate(showTpl, this).html);
    }
});

// Hook
AutoForm.hooks({
    school_departmentInsert: {
        before: {
            insert: function (doc) {
                doc._id = idGenerator.gen(School.Collection.Department, 3);
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
    school_departmentUpdate: {
        onSuccess: function (formType, result) {
            alertify.department().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});
