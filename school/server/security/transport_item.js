// Transport Item
School.Collection.TransportItem.permit(['insert', 'update', 'remove'])
  .school_ifSetting()
  .apply();
