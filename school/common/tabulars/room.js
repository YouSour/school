School.TabularTable.Room = new Tabular.Table({
    name: "schoolRoomList",
    collection: School.Collection.Room,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.school_roomAction},
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "number", title: "Number of Student"},
        {data: "_classCount", title: "Class+"}
    ]
});
