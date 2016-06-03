// Teacher
School.Collection.Teacher.permit(['insert'])
  .school_ifDataInsert()
  .apply();

School.Collection.Teacher.permit(['update'])
  .school_ifDataUpdate()
  .apply();

School.Collection.Teacher.permit(['remove'])
  .school_ifDataRemove()
  .apply();
