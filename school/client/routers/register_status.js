var subs = new SubsManager();
schoolRoutes.route('/registerStatus/:studentId/:registerId', {
    name: 'school.registerStatus',
    subscriptions: function (params, queryParams) {
        this.register('school_registerStatusByRegister', Meteor.subscribe('school_registerStatusByRegister', params.registerId));
        this.register('school_studentById', Meteor.subscribe('school_student', params.studentId));
        this.register('school_registerById', Meteor.subscribe('school_register', params.registerId));
    },
    action: function (params, queryParams) {
        Layout.main('school_registerStatus');
    },
    breadcrumb: {
        params: ['studentId', 'registerId'],
        //queryParams: ['show', 'color'],
        title: 'Register Status',
        parent: 'school.register'
    }
});
