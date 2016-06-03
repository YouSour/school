// SaleCustomer
School.Collection.SaleCustomer.permit(['insert'])
  .school_ifDataInsert()
  .apply();

School.Collection.SaleCustomer.permit(['update'])
  .school_ifDataUpdate()
  .apply();

School.Collection.SaleCustomer.permit(['remove'])
  .school_ifDataRemove()
  .apply();
