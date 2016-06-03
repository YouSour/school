function getBackupType(type) {
    var settingType = [
        'Cpanel.Collection.Branch',
        'Cpanel.Collection.Company',
        'Cpanel.Collection.Setting',
        'Cpanel.Collection.Currency',
        'Cpanel.Collection.Exchange',

        'Events',
        'Meteor.roles',
        //files
        'School.Collection.Department',
        'School.Collection.Course',
        'School.Collection.SaleCategory',
        'School.Collection.SaleItem',
        'School.Collection.TransportItem',
        'Meteor.users'
    ];
    var defaultType = [
        'School.Collection.Class',
        'School.Collection.Student',
        'School.Collection.Register',
        'School.Collection.RegisterStatus',
        'School.Collection.Payment',
        'School.Collection.Transport',
        'School.Collection.Sale'
    ];

    if (type == 'Setting') {
        return settingType;
    } else if (type == 'Default') {
        return defaultType;
    } else {
        return defaultType.concat(settingType);
    }
}
AutoForm.hooks({
    school_backup: {
        onSubmit: function (doc) {
            debugger;
            var backupType = doc.backupType;
            var collections = getBackupType(backupType);
            var module = Session.get('currentModule');
            debugger;
            backup(module,"cpanel_branchId",backupType,collections,doc.branch);
            return false;
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});