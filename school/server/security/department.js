// Department
School.Collection.Department.permit(['insert', 'update', 'remove'])
  .school_ifSetting()
  .apply();
