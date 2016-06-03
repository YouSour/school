// Collection
School.Collection.Register = new Mongo.Collection("school_register");

// Schema
School.Schema.Register = new SimpleSchema({
    studentId: {
        type: String
        //autoform: {
        //    type: "select2",
        //    options: function () {
        //        return School.List.student()
        //    }
        //}
    },
    registerDate: {
        type: Date,
        defaultValue: function () {
            return moment().format('YYYY-MM-DD');
        }
    },
    courseId: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.List.course()
            }
        }
    },
    classId: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.List.classForCourse();
            }
        }
    },
    //defaultPaymentMethod: {
    //    type: String,
    //    autoform: {
    //        type: "select2",
    //        options: function () {
    //            return School.List.defaultPaymentMethodForRegister();
    //        }
    //    }
    //},
    newOld: {
        type: String,
        label: "New/Old",
        max: 50
    },
    cpanel_branchId: {
        type: String
    }
});

// Attach schema
School.Collection.Register.attachSchema(School.Schema.Register);
