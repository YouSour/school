var subs = new SubsManager();
schoolRoutes.route('/backup', {
    name: 'school.backup',
    action: function (params, queryParams) {
        Layout.main('school_backup');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Backup',
        parent: 'school.home'
    }
});
