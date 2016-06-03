// Collection
School.Collection.TransportItem = new Mongo.Collection("school_transportItem");

// Schema
School.Schema.TransportItem = new SimpleSchema({
    name: {
        type: String,
        label: 'Location name',
        max: 250,
        unique: true
    },
    zone: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.ListForSale.zone();
            }
        }
    },
    paymentMethod: {
        type: Array,
        minCount: 1,
        maxCount: 6
    },
    'paymentMethod.$': {
        type: Object
    },
    'paymentMethod.$.term': {
        type: Number,
        autoform: {
            type: "select",
            //type: "selectize",
            options: function () {
                return School.ListForSale.transportTermForSetting();
            }
        }
    },
    'paymentMethod.$.single': {
        type: Number,
        decimal: true
    },
    'paymentMethod.$.twice': {
        type: Number,
        decimal: true
    },
    'paymentMethod.$.threeTimes': {
        type: Number,
        decimal: true
    },
    'paymentMethod.$.fourTimes': {
        type: Number,
        decimal: true
    }
});

// Attach schema
School.Collection.TransportItem.attachSchema(School.Schema.TransportItem);
