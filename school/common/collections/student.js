// Collection
School.Collection.Student = new Mongo.Collection("school_student");

// Schema
var Family = new SimpleSchema({
    fatherName: {
        type: String,
        label: "Father's name",
        max: 250
    },
    fatherJob: {
        type: String,
        label: "Father's job",
        max: 500
    },
    motherName: {
        type: String,
        label: "Mother's name",
        max: 250
    },
    motherJob: {
        type: String,
        label: "Mother's job",
        max: 500
    }
});

var Emergency = new SimpleSchema({
    name: {
        type: String,
        max: 250
    },
    relation: {
        type: String,
        max: 250
    },
    contact: {
        type: String,
        max: 250
    }
});


School.Schema.Student = new SimpleSchema({
    khName: {
        type: String,
        max: 250
    },
    enName: {
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
        label: "Date of birth"
    },
    pob: {
        type: String,
        label: "Place of birth",
        max: 500,
        optional: true
    },
    nationality: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.List.nationality();
            }
        }
    },
    address: {
        type: String,
        max: 500
    },
    telephone: {
        type: String,
        max: 100,
        optional: true
    },
    emergency: {
        type: Emergency,
        optional: true
    },
    behavior: {
        type: String,
        max: 500,
        optional: true
    },
    health: {
        type: String,
        max: 500,
        optional: true
    },
    family: {
        type: Family,
        optional: true
    },
    transform: {
        type: String,
        max: 500,
        optional: true
    },
    request: {
        type: String,
        max: 500,
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
School.Collection.Student.attachSchema(School.Schema.Student);
