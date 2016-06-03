var subs = new SubsManager();
schoolRoutes.route('/saleCustomer', {
    name: 'school.saleCustomer',
    subscriptions: function (params, queryParams) {
        this.register('school_saleCustomerByBranch', Meteor.subscribe('school_saleCustomerByBranch', Session.get('currentBranch')));
    },
    action: function (params, queryParams) {
        Layout.main('school_saleCustomer');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Sale Customer',
        parent: 'school.home'
    }
});
