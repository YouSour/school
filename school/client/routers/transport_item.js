var subs = new SubsManager();
schoolRoutes.route('/transportItem', {
    name: 'school.transportItem',
    subscriptions: function (params, queryParams) {
        this.register('school_transportItem', Meteor.subscribe('school_transportItem'));
    },
    action: function (params, queryParams) {
        Layout.main('school_transportItem');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Transport Item',
        parent: 'school.home'
    }
});
