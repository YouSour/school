/**
 * Register Status
 */
//School.Collection.RegisterStatus.after.insert(function (userId, doc) {
//    Meteor.defer(function () {
//        School.Collection.Register.update(doc.registerId, {
//            $set: {
//                status: doc.status,
//                statusDate: doc.statusDate
//            }
//        });
//    });
//});
//
//School.Collection.RegisterStatus.after.update(function (userId, doc, fieldNames, modifier, options) {
//    modifier.$set = modifier.$set || {};
//
//    Meteor.defer(function () {
//        if (!_.isUndefined(modifier.$set.status) && !_.isUndefined(modifier.$set.statusDate)) {
//            School.Collection.Register.update(modifier.$set.registerId, {
//                $set: {
//                    status: modifier.$set.status,
//                    statusDate: modifier.$set.statusDate
//                }
//            });
//        }
//    });
//});
//
//School.Collection.RegisterStatus.after.remove(function (userId, doc) {
//    Meteor.defer(function () {
//        var canUpdateRegister = true;
//        var status, statusDate;
//        var lastStatus = School.Collection.RegisterStatus.findOne({registerId: doc.registerId}, {sort: {_id: -1}});
//
//        if (_.isUndefined(lastStatus)) {
//            var register = School.Collection.Register.findOne(doc.registerId);
//            if (!_.isUndefined(register)) {
//                status = 'active';
//                statusDate = register.registerDate;
//            } else {
//                canUpdateRegister = false;
//            }
//        } else {
//            status = lastStatus.status;
//            statusDate = lastStatus.statusDate;
//        }
//
//        if (canUpdateRegister) {
//            School.Collection.Register.update(doc.registerId, {
//                $set: {
//                    status: status,
//                    statusDate: statusDate
//                }
//            });
//        }
//    });
//});