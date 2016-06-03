/**
 * Declare template
 */
var indexTpl = Template.school_saleCategory;
var insertTpl = Template.school_saleCategoryInsert;
var updateTpl = Template.school_saleCategoryUpdate;
var showTpl = Template.school_saleCategoryShow;

/**
 * Index
 */
indexTpl.onRendered(function () {
    // SEO
    SEO.set({
        title: 'Sale Category',
        description: 'Description for this page'
    });

    // Create new  alertify
    createNewAlertify('saleCategory');
});

indexTpl.events({
    'click .insert': function (e, t) {
        alertify.saleCategory(fa("plus", "Sale Category"), renderTemplate(insertTpl));
        //.maximize();
    },
    'click .update': function (e, t) {
        var data = School.Collection.SaleCategory.findOne(this._id);

        alertify.saleCategory(fa("pencil", "Sale Category"), renderTemplate(updateTpl, data));
        //.maximize();
    },
    'click .remove': function (e, t) {
        var self = this;

        alertify.confirm(
            fa("remove", "Sale Category"),
            "Are you sure to delete [" + self._id + "]?",
            function () {
                School.Collection.SaleCategory.remove(self._id, function (error) {
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
        var data = School.Collection.SaleCategory.findOne({_id: this._id});

        alertify.alert(fa("eye", "Sale Category"), renderTemplate(showTpl, data).html);
    }
});

/**
 * Hook
 */
AutoForm.hooks({
    school_saleCategoryInsert: {
        before: {
            insert: function (doc) {
                doc._id = idGenerator.gen(School.Collection.SaleCategory, 3);
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
    school_saleCategoryUpdate: {
        onSuccess: function (formType, result) {
            alertify.saleCategory().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});
