School.TabularTable.Sale = new Tabular.Table({
    name: "schoolSaleList",
    collection: School.Collection.Sale,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.school_saleAction},
        //{data: "_id", title: "ID"},
        {
            data: "saleDate", title: "Sale Date",
            render: function (val, type, doc) {
                return moment(val).format('YYYY-MM-DD');
            }
        },
        {
            data: "items", title: "Items",
            render: function (val, type, doc) {
                var item = '<ul>';
                val.forEach(function (obj) {
                    item += '<li>' +
                        "Item ID: " + obj.itemId +
                        " | Qty: " + obj.qty +
                        " | Price: " + numeral(obj.price).format('0,0.00') +
                        " | Discount: " + obj.discount +
                        " | Amount: " + numeral(obj.amount).format('0,0.00');
                });
                item += '</ul>';

                return item;
            }
        },
        {
            data: "totalAmount",
            title: "Total Amount",
            render: function (val, type, doc) {
                return numeral(val).format('0,0.00');
            }
        },
        {
            data: "voucherId", title: "Voucher",
            render: function (val, type, doc) {
                return (val).substr(8);
            }
        }
    ]
});