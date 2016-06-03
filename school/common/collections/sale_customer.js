// Collection
School.Collection.SaleCustomer = new Mongo.Collection("school_saleCustomer");

// Schema
School.Schema.SaleCustomer = new SimpleSchema({
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
    des: {
        type: String,
        label: 'Description',
        max: 500,
        optional: true
    },
    cpanel_branchId: {
        type: String
    }

});

// Attach schema
School.Collection.SaleCustomer.attachSchema(School.Schema.SaleCustomer);
