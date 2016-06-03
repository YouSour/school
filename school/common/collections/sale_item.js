/**
 * Collection
 *
 * @type {Mongo.Collection}
 */
School.Collection.SaleItem = new Mongo.Collection("school_saleItem");

/**
 * Schema
 *
 * @type {SimpleSchema}
 */
School.Schema.SaleItem = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 250,
        unique: true
    },
    currencyId: {
        type: String,
        label: "Currency",
        autoform: {
            type: "select2",
            options: function () {
                return School.ListForSale.currency();
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
    fromAmount: {
        type: Number,
        label: "From Amount",
        decimal: true
    },
    price: {
        type: Number,
        label: "Price",
        decimal: true
    },
    saleCategoryId: {
        type: String,
        label: "Sale Category",
        autoform: {
            type: "select2",
            options: function () {
                return School.ListForSale.saleCategory();
            }
        }
    }
});

/**
 * Attach schema
 */
School.Collection.SaleItem.attachSchema(School.Schema.SaleItem);
