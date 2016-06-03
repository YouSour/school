School.TabularTable.Course = new Tabular.Table({
    name: "schoolCourseList",
    collection: School.Collection.Course,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.school_courseAction},
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "term", title: "Term (Month)"},
        {
            data: "baseAmount",
            title: "Base Amount (Month)",
            render: function (val, type, doc) {
                return numeral(val).format('0,0.00');
            }
        },
        {
            data: "paymentMethod", title: "Payment Method",
            render: function (val, type, doc) {
                var paymentM = '<ul>';
                val.forEach(function (obj) {
                    if (obj != null) {
                        paymentM += "<li>" +
                            obj.term + ' Month = ' + numeral(obj.amount).format('0,000.00') +
                            "</li>";
                    }
                });
                paymentM += '</ul>';

                return paymentM;
            }
        },
        {data: "status", title: "Status"},
        //{data: "departmentId", title: "Dep ID"},
        {data: "_department.shortName", title: "Dep Short Name"},
        {data: "_classCount", title: "Class+"}
    ]
});