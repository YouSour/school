// Staff
School.Collection.Staff.permit(['insert'])
  .school_ifDataInsert()
  .apply();

School.Collection.Staff.permit(['update'])
  .school_ifDataUpdate()
  .apply();

School.Collection.Staff.permit(['remove'])
  .school_ifDataRemove()
  .apply();
