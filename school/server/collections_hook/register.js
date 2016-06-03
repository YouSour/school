/**
 * Register
 */
//School.Collection.Register.after.insert(function (userId, doc) {
//    Meteor.defer(function () {
//        var registerStatusId = idGenerator.genWithPrefix(School.Collection.RegisterStatus, doc._id, 3);
//        var data = {
//            _id: registerStatusId,
//            registerId: doc._id,
//            status: doc.status,
//            statusDate: doc.statusDate,
//            des: 'Init',
//            cpanel_branchId: doc.cpanel_branchId
//        };
//
//        School.Collection.RegisterStatus.direct.insert(data);
//    });
//});

//School.Collection.Register.after.remove(function (userId, doc) {
//    Meteor.defer(function () {
//        School.Collection.RegisterStatus.direct.remove({registerId: doc._id});
//    });
//});