// Collection
School.Collection.Course = new Mongo.Collection("school_course");

// Schema
School.Schema.Course = new SimpleSchema({
    name: {
        type: String,
        max: 250,
        unique: true
    },
    term: {
        type: Number,
        label: 'Term (Month)'
    },
    baseAmount: {
        type: Number,
        label: 'Base Amount (Month)',
        decimal: true
    },
    paymentMethod: {
        type: Array,
        minCount: 1
    },
    'paymentMethod.$': {
        type: Object
    },
    'paymentMethod.$.term': {
        type: Number,
        autoform: {
            type: "select",
            options: function () {
                return School.List.paymentMethodTerm();
            }
        }
    },
    'paymentMethod.$.cost': {
        type: Number,
        decimal: true
    },
    'paymentMethod.$.discount': {
        type: Number,
        decimal: true
    },
    'paymentMethod.$.amount': {
        type: Number,
        decimal: true
    },
    status: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.List.enDisabled();
            }
        }
    },
    des: {
        type: String,
        label: "Description",
        max: 500,
        optional: true
    },
    departmentId: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.List.department();
            }
        }
    }
});

// Attach schema
School.Collection.Course.attachSchema(School.Schema.Course);
