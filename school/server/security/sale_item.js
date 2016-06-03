// Sale Item
School.Collection.SaleItem.permit(['insert', 'update', 'remove'])
  .school_ifSetting()
  .apply();
