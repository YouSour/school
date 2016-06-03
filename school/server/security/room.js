// Room
School.Collection.Room.permit(['insert'])
  .school_ifDataInsert()
  .apply();

School.Collection.Room.permit(['update'])
  .school_ifDataUpdate()
  .apply();

School.Collection.Room.permit(['remove'])
  .school_ifDataRemove()
  .apply();
