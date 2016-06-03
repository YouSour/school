// Student
School.Collection.Student.permit(['insert'])
  .school_ifDataInsert()
  .apply();

School.Collection.Student.permit(['update'])
  .school_ifDataUpdate()
  .apply();

School.Collection.Student.permit(['remove'])
  .school_ifDataRemove()
  .apply();
