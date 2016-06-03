// Sale Category
School.Collection.SaleCategory.permit(['insert', 'update', 'remove'])
  .school_ifSetting()
  .apply();
