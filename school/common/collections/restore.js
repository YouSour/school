
School.Schema.Restore = new SimpleSchema({
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
    restoreType:{
        type:String,
        label:"Restore Type",
        autoform: {
            type: "select2",
            options:function(){
               return School.List.backupAndRestoreTypes();
            }
        }
    }
});