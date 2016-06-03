// Collection
School.Collection.Class = new Mongo.Collection("school_class");

// Schema
School.Schema.Classes = new SimpleSchema({
    name: {
        type: String,
        max: 200
    },
    courseId: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.List.course();
            }
        }
    },
    startDate: {
        type: Date,
        defaultValue: function () {
            return moment().format('YYYY-MM-DD');
        }
    },
    endDate: {
        type: Date
    },
    teacherId: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.List.teacher();
            }
        }
    },
    roomId: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.List.room();
            }
        }
    },
    dayOfWeek: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.List.dayOfWeek();
            }
        }
    },
    group: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.List.group();
            }
        }
    },
    time: {
        type: String,
        max: 100
    },
    des: {
        type: String,
        label: "Description",
        max: 500,
        optional: true
    },
    status: {
        type: String
    },
    statusDate: {
        type: Date
    },
    cpanel_branchId: {
        type: String
    }
});

// Attach schema
School.Collection.Class.attachSchema(School.Schema.Classes);
