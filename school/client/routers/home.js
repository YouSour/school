var subs = new SubsManager();
schoolRoutes.route('/home', {
    name: 'school.home',
    action: function (params, queryParams) {
        Layout.main('school_home');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Home'
        //parent: 'cpanel.welcome'
    }
});

