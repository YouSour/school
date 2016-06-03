School.TabularTable.RegisterStatus = new Tabular.Table({
    name: "schoolRegisterStatusList",
    collection: School.Collection.RegisterStatus,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.school_registerStatusAction},
        //{data: "_id", title: "ID"},
        //{data: "registerId", title: "Register"},
        {
            data: "statusDate",
            title: "Status Date",
            render: function (val, type, doc) {
                return moment(val).format('YYYY-MM-DD');
            }
        },
        {data: "status", title: "Status"},
        {data: "des", title: "Description"}
    ]
});
