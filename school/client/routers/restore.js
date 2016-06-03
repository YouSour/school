var subs = new SubsManager();
schoolRoutes.route('/restore', {
    name: 'school.restore',
    action: function (params, queryParams) {
        Layout.main('school_restore');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Restore',
        parent: 'school.home'
    }
});
