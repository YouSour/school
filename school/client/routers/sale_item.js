var subs = new SubsManager();
schoolRoutes.route('/saleItem', {
    name: 'school.saleItem',
    subscriptions: function (params, queryParams) {
        this.register('school_saleItem', Meteor.subscribe('school_saleItem'));
        this.register('school_saleCategory', Meteor.subscribe('school_saleCategory'));
        this.register('school_exchange', Meteor.subscribe('school_exchange'));
    },
    action: function (params, queryParams) {
        Layout.main('school_saleItem');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Sale Item',
        parent: 'school.home'
    }
});
