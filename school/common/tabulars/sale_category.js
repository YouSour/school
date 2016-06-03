School.TabularTable.SaleCategory = new Tabular.Table({
    name: "schoolSaleCategoryList",
    collection: School.Collection.SaleCategory,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.school_saleCategoryAction},
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "shortName", title: "Short Name"},
        {data: "_saleItemCount", title: "Item+"}
    ]
});