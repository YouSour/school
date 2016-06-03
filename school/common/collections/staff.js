// Collection
School.Collection.Staff = new Mongo.Collection("school_staff");

// Schema
School.Schema.Staff = new SimpleSchema({
    name: {
        type: String,
        max: 250
    },
    gender: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.List.gender();
            }
        }
    },
    dob: {
        type: Date,
        label: "Date of Birth",
        defaultValue: function () {
            return moment().format('YYYY-MM-DD');
        }
    },
    maritalStatus: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.List.maritalStatus();
            }
        }
    },
    position: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.List.position();
            }
        }
    },
    address: {
        type: String,
        max: 500,
        optional: true
    },
    telephone: {
        type: String,
        max: 100,
        optional: true
    },
    photo: {
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Files',
                accept: 'image/*'
            }
        },
        optional: true
    },
    cpanel_branchId: {
        type: String
    }

});

// Attach schema
School.Collection.Staff.attachSchema(School.Schema.Staff);
