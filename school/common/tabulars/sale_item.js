School.TabularTable.SaleItem = new Tabular.Table({
    name: "schoolSaleItemList",
    collection: School.Collection.SaleItem,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.school_saleItemAction},
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "price", title: "Price"},
        {data: "saleCategoryId", title: "Cate Id"},
        {data: "_saleCategory.name", title: "Cate Name"},
        {data: "_saleCategory.shortName", title: "Cate Short Name"}
    ]
});