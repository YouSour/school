// SaleCustomer
School.TabularTable.SaleCustomer = new Tabular.Table({
    name: "schoolSaleCustomerList",
    collection: School.Collection.SaleCustomer,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['2', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.school_saleCustomerAction},
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "gender", title: "Gender"},
        {data: "address", title: "Address"},
        {data: "telephone", title: "Telephone"},
        {data: "des", title: "Description"},
        {title: 'Sale+', tmpl: Meteor.isClient && Template.school_saleCustomerActionSale}
    ],
    extraFields: ['_saleCount']
});