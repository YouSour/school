School.TabularTable.Register = new Tabular.Table({
    name: "schoolRegisterList",
    collection: School.Collection.Register,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.school_registerAction},
        {data: "_id", title: "ID"},
        //{data: "studentId", title: "Student"},
        {
            data: "registerDate",
            title: "Reg Date",
            render: function (val, type, doc) {
                return moment(val).format('YYYY-MM-DD');
            }
        },
        {data: "_class.name", title: "Class Name"},
        {data: "_class.status", title: "Class Status"},
        {
            data: "_class.startDate",
            title: "Start",
            render: function (val, type, doc) {
                return moment(val).format('YYYY-MM-DD');
            }
        },
        {
            data: "_class.endDate",
            title: "End",
            render: function (val, type, doc) {
                return moment(val).format('YYYY-MM-DD');
            }
        },
        {data: "_class._room.name", title: "Room"},
        {data: "newOld", title: "N/O"},
        {title: 'Status+', tmpl: Meteor.isClient && Template.school_registerActionStatus},
        {title: 'Paid+', tmpl: Meteor.isClient && Template.school_registerActionPayment}
    ],
    extraFields: ['_paymentCount', '_statusCount']
});