/**
 * Collection
 *
 * @type {Mongo.Collection}
 */
School.Collection.SaleCategory = new Mongo.Collection("school_saleCategory");

/**
 * Schema
 *
 * @type {SimpleSchema}
 */
School.Schema.SaleCategory = new SimpleSchema({
    name: {
        type: String,
        max: 250,
        unique: true
    },
    shortName: {
        type: String,
        max: 50,
        unique: true
    }
});

/**
 * Attach schema
 */
School.Collection.SaleCategory.attachSchema(School.Schema.SaleCategory);
