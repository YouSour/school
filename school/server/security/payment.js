// Payment
School.Collection.Payment.permit(['insert'])
  .school_ifDataInsert()
  .apply();

School.Collection.Payment.permit(['update'])
  .school_ifDataUpdate()
  .apply();

School.Collection.Payment.permit(['remove'])
  .school_ifDataRemove()
  .apply();
