var subs = new SubsManager();
schoolRoutes.route('/transport/:studentId', {
    name: 'school.transport',
    subscriptions: function (params, queryParams) {
        this.register('school_transportByStudent', Meteor.subscribe('school_transportByStudent', params.studentId));
        this.register('school_studentById', Meteor.subscribe('school_student', params.studentId));
        this.register('school_transportItem', Meteor.subscribe('school_transportItem'));
        this.register('school_staffByBranch', Meteor.subscribe('school_staffByBranch', Session.get('currentBranch')));
        this.register('school_exchange', Meteor.subscribe('school_exchange'));
    },
    action: function (params, queryParams) {
        Layout.main('school_transport');
    },
    breadcrumb: {
        params: ['studentId'],
        //queryParams: ['show', 'color'],
        title: 'Transport',
        parent: 'school.student'
    }
});
