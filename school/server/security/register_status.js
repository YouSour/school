// Register Status
School.Collection.RegisterStatus.permit(['insert'])
  .school_ifDataInsert()
  .apply();

School.Collection.RegisterStatus.permit(['update'])
  .school_ifDataUpdate()
  .apply();

School.Collection.RegisterStatus.permit(['remove'])
  .school_ifDataRemove()
  .apply();
