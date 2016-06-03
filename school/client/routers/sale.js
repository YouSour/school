var subs = new SubsManager();
schoolRoutes.route('/sale/:customerId', {
    name: 'school.sale',
    subscriptions: function (params, queryParams) {
        this.register('school_saleByCustomer', Meteor.subscribe('school_saleByCustomer', params.customerId));
        this.register('school_saleCustomerById', Meteor.subscribe('school_saleCustomer', params.customerId));
        this.register('school_saleCategory', Meteor.subscribe('school_saleCategory'));
        this.register('school_saleItem', Meteor.subscribe('school_saleItem'));
        this.register('school_staffByBranch', Meteor.subscribe('school_staffByBranch', Session.get('currentBranch')));
        this.register('school_exchange', Meteor.subscribe('school_exchange'));
    },
    action: function (params, queryParams) {
        Layout.main('school_sale');
    },
    breadcrumb: {
        params: ['customerId'],
        //queryParams: ['show', 'color'],
        title: 'Sale',
        parent: 'school.saleCustomer'
    }
});
