School.TabularTable.Class = new Tabular.Table({
    name: "schoolClassList",
    collection: School.Collection.Class,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.school_classAction},
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "_course.name", title: "Course"},
        {
            data: "startDate",
            title: "Start date",
            render: function (val, type, doc) {
                return moment(val).format('YYYY-MM-DD');
            }
        },
        {
            data: "endDate",
            title: "End date",
            render: function (val, type, doc) {
                return moment(val).format('YYYY-MM-DD');
            }
        },
        //{data: "roomId", title: "Room"},
        {data: "_room.name", title: "Room"},
        //{data: "teacherId", title: "Teacher"},
        {data: "_teacher.name", title: "Teacher"},
        //{data: "dayOfWeek", title: "Day of Week"},
        //{data: "group", title: "Group"},
        //{data: "time", title: "Time"},
        {title: 'Status', tmpl: Meteor.isClient && Template.school_classActionStatus},
        //{data: "status.value", title: "Status"},
        {data: "_registerCount", title: "Reg+"}
    ],
    extraFields: ['status', 'statusDate']
});