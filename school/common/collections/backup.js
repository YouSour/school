
School.Schema.Backup = new SimpleSchema({
    branch:{
        type:String,
        label:"Branch",
        autoform: {
            type: "select2",
            options:function(){
                return School.List.branchForUser();
            }
        },
        optional:true
    },

    backupType:{
        type:String,
        label:"Backup Type",
        autoform: {
            type: "select2",
            options:function() {
                return School.List.backupAndRestoreTypes();
            }
        }
    }
});