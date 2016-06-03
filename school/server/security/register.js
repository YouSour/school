// Register
School.Collection.Register.permit(['insert'])
  .school_ifDataInsert()
  .apply();

School.Collection.Register.permit(['update'])
  .school_ifDataUpdate()
  .apply();

School.Collection.Register.permit(['remove'])
  .school_ifDataRemove()
  .apply();
