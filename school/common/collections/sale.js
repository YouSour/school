/**
 * Collection
 *
 * @type {Mongo.Collection}
 */
School.Collection.Sale = new Mongo.Collection("school_sale");

/**
 * Schema
 *
 * @type {SimpleSchema}
 */
School.Schema.Sale = new SimpleSchema({
    customerId: {
        type: String
    },
    staffId: {
        type: String,
        label: "Staff",
        autoform: {
            type: "select2",
            options: function () {
                return School.List.staff();
            }
        }
    },
    saleDate: {
        type: Date,
        label: "Sale Date",
        defaultValue: function () {
            return moment().format('YYYY-MM-DD');
        }
    },
    items: {
        type: Array,
        label: "Items",
        minCount: 1
    },
    'items.$': {
        type: Object
    },
    'items.$.itemId': {
        type: String,
        autoform: {
            type: "selectize",
            options: function () {
                return School.ListForSale.saleItem();
            }
        }
    },
    'items.$.qty': {
        type: Number,
        min: 1
    },
    'items.$.price': {
        type: Number,
        decimal: true
    },
    'items.$.discount': {
        type: Number,
        decimal: true,
        min: 0,
        max: 100
    },
    'items.$.amount': {
        type: Number,
        decimal: true
    },
    totalAmount: {
        type: Number,
        decimal: true
    },
    voucherId: {
        type: String,
        custom: function () {
            var data = School.Collection.Sale.find({
                name: this.value,
                cpanel_branchId: this.field('cpanel_branchId').value
            });
            if (data.count() > 0) {
                return "uniqueVoucher";
            }
        }
    },
    exchangeId: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.List.exchange();
            }
        }
    },
    cpanel_branchId: {
        type: String
    }
});

/**
 * Attach schema
 */
School.Collection.Sale.attachSchema(School.Schema.Sale);

// Custom message
SimpleSchema.messages({
    "uniqueVoucher": "[label] must be unique."
});