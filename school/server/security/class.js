// Class
School.Collection.Class.permit(['insert'])
  .school_ifDataInsert()
  .apply();

School.Collection.Class.permit(['update'])
  .school_ifDataUpdate()
  .apply();

School.Collection.Class.permit(['remove'])
  .school_ifDataRemove()
  .apply();
