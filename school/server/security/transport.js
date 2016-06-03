// Transport
School.Collection.Transport.permit(['insert'])
    .school_ifDataInsert()
    .apply();

School.Collection.Transport.permit(['update'])
    .school_ifDataUpdate()
    .apply();

School.Collection.Transport.permit(['remove'])
    .school_ifDataRemove()
    .apply();
