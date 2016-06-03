School.TabularTable.Department = new Tabular.Table({
    name: "schoolDepartmentList",
    collection: School.Collection.Department,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.school_departmentAction},
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "shortName", title: "Short Name"},
        {data: "_courseCount", title: "Course+"}
    ]
});