// Course
School.Collection.Course.permit(['insert', 'update', 'remove'])
  .school_ifSetting()
  .apply();
