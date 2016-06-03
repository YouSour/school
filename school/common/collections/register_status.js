// Collection
School.Collection.RegisterStatus = new Mongo.Collection("school_registerStatus");

// Schema
School.Schema.RegisterStatus = new SimpleSchema({
    registerId: {
        type: String
    },
    status: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.List.registerStatus();
            }
        }
    },
    statusDate: {
        type: Date,
        defaultValue: function () {
            return moment().format('YYYY-MM-DD');
        }
    },
    des: {
        type: String,
        label: "Description",
        max:500
    },
    cpanel_branchId: {
        type: String
    }
});

// Attach schema
School.Collection.RegisterStatus.attachSchema(School.Schema.RegisterStatus);
