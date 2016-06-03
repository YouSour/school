var subs = new SubsManager();
schoolRoutes.route('/course', {
    name: 'school.course',
    subscriptions: function (params, queryParams) {
        this.register('school_course', Meteor.subscribe('school_course'));
        this.register('school_department', Meteor.subscribe('school_department'));
    },
    action: function (params, queryParams) {
        Layout.main('school_course');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Course',
        parent: 'school.home'
    }
});
