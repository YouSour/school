var subs = new SubsManager();
schoolRoutes.route('/saleCategory', {
    name: 'school.saleCategory',
    subscriptions: function (params, queryParams) {
        this.register('school_saleCategory', Meteor.subscribe('school_saleCategory'));
    },
    action: function (params, queryParams) {
        Layout.main('school_saleCategory');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Sale Category',
        parent: 'school.home'
    }
});
