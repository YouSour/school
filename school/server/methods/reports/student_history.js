Meteor.methods({
    school_studentHistoryReport: function (params) {
        this.unblock();

        var data = {
            title: {},
            header: {},
            content: [{index: 'No Result'}],
            footer: {}
        };

        /****** Title *****/
        data.title = Cpanel.Collection.Company.findOne();

        /****** Header *****/
        var student = School.Collection.Student.findOne(params.student);
        data.header = student;

        /****** Content *****/
        var content = [];
        var selector = {};

        if (!_.isEmpty(params.student)) {
            selector.studentId = params.student;
        }
        if (!_.isEmpty(params.register)) {
            selector._id = params.register;
        }

        content = School.Collection.Register.find(selector, {sort: {registerDate: 1}}).fetch();

        if (content.length > 0) {
            data.content = content;
        }

        return data;
    }
});
