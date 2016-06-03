var subs = new SubsManager();
schoolRoutes.route('/payment/:studentId/:registerId', {
    name: 'school.payment',
    subscriptions: function (params, queryParams) {
        this.register('school_paymentByRegister', Meteor.subscribe('school_paymentByRegister', params.registerId));
        this.register('school_studentById', Meteor.subscribe('school_student', params.studentId));
        this.register('school_registerById', Meteor.subscribe('school_register', params.registerId));
        this.register('school_staffByBranch', Meteor.subscribe('school_staffByBranch', Session.get('currentBranch')));
        this.register('school_exchange', Meteor.subscribe('school_exchange'));
    },
    action: function (params, queryParams) {
        Layout.main('school_payment');
    },
    breadcrumb: {
        params: ['studentId', 'registerId'],
        //queryParams: ['show', 'color'],
        title: 'Payment',
        parent: 'school.register'
    }
});
