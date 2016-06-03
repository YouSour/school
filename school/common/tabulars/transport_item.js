School.TabularTable.TransportItem = new Tabular.Table({
    name: "schoolTransportItemList",
    collection: School.Collection.TransportItem,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.school_transportItemAction},
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "zone", title: "Zone"},
        {
            data: "paymentMethod", title: "Payment Method",
            render: function (val, type, doc) {
                var items = '<ul>';
                val.forEach(function (obj) {
                    if (obj != null) {
                        items += "<li>" +
                            "Term: " + obj.term +
                            ", Single: " + obj.single +
                            ", Twice: " + obj.twice +
                            ", Three Times: " + obj.threeTimes +
                            ", Four Times: " + obj.fourTimes +
                            "</li>";
                    }
                });
                items += '</ul>';

                return items;
            }
        },
        {
            data: "_transportCount", title: "Transport+"
        }
    ]
});