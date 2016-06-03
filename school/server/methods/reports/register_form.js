Meteor.methods({
    school_registerFormReport: function (params) {
        this.unblock();

        var data = {
            title: {},
            header: {},
            content: {},
            footer: {}
        };

        /****** Title *****/
        data.title = Cpanel.Collection.Company.findOne();

        /****** Content *****/
        var content = School.Collection.Register.findOne(params.id);
        if (!_.isUndefined(content._student.photo)) {
            content._student.photoUrl = Files.findOne(content._student.photo).url();
        }

        data.content = content;
        return data;
    }
});
