School.TabularTable.Teacher = new Tabular.Table({
    name: "schoolTeacherList",
    collection: School.Collection.Teacher,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.school_teacherAction},
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "gender", title: "Gender"},
        {
            data: "dob",
            title: "DoB",
            render: function (val, type, doc) {
                return moment(val).format('YYYY-MM-DD');
            }
        },
        {data: "maritalStatus", title: "Marital Status"},
        //{data: "address", title: "Address"},
        {data: "telephone", title: "Telephone"},
        {data: "_classCount", title: "Class+"},
        {
            data: "photo",
            title: "Photo",
            render: function (val, type, doc) {
                if (_.isUndefined(val)) {
                    return null;
                } else {
                    var img = Files.findOne(val);
                    return lightbox(img.url(), doc._id, doc.name);
                }
            }
        }
    ]
});