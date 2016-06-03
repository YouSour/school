var subs = new SubsManager();
schoolRoutes.route('/class', {
    name: 'school.class',
    subscriptions: function (params, queryParams) {
        this.register('school_classByBranch', Meteor.subscribe('school_classByBranch', Session.get('currentBranch')));
        this.register('school_course', Meteor.subscribe('school_course'));
        this.register('school_teacherByBranch', Meteor.subscribe('school_teacherByBranch', Session.get('currentBranch')));
        this.register('school_roomByBranch', Meteor.subscribe('school_roomByBranch', Session.get('currentBranch')));
    },
    action: function (params, queryParams) {
        Layout.main('school_class');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Class',
        parent: 'school.home'
    }
});
