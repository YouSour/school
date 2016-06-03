// Sale
School.Collection.Sale.permit(['insert'])
  .school_ifDataInsert()
  .apply();

School.Collection.Sale.permit(['update'])
  .school_ifDataUpdate()
  .apply();

School.Collection.Sale.permit(['remove'])
  .school_ifDataRemove()
  .apply();
