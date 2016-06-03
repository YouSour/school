//  Collection
School.Collection.Department = new Mongo.Collection("school_department");

// Schema
School.Schema.Department = new SimpleSchema({
    name: {
        type: String,
        unique: true,
        max: 250
    },
    shortName: {
        type: String,
        unique: true,
        max: 50
    }
});

// Attach schema
School.Collection.Department.attachSchema(School.Schema.Department);
