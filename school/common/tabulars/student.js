// Student
School.TabularTable.Student = new Tabular.Table({
    name: "schoolStudentList",
    collection: School.Collection.Student,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['2', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.school_studentAction},
        {data: "_id", title: "ID"},
        {data: "khName", title: "Kh Name"},
        {data: "enName", title: "En Name"},
        {data: "gender", title: "Gender"},
        //{data: "address", title: "Address"},
        {data: "telephone", title: "Telephone"},
        {
            data: "emergency",
            title: "Emergency",
            render: function (val, type, doc) {
                if (_.isUndefined(val)) {
                    return null;
                }
                return val.name + ' (' + val.contact + ')';
            }
        },
        //{data: "_registerCount", title: "Reg+"},
        {title: 'Reg+', tmpl: Meteor.isClient && Template.school_studentActionRegister},
        {title: 'Tran+', tmpl: Meteor.isClient && Template.school_studentActionTransport},
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
    ],
    extraFields: ['_registerCount', '_transportCount']
});