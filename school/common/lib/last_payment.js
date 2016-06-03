// Get last payment
lastPayment = function (registerId, activeDate) {
    var lastPayment;
    var selector = {registerId: registerId};
    if (!_.isUndefined(activeDate)) {
        selector.paymentDate = {$lte: activeDate};
    }
    lastPayment = School.Collection.Payment.findOne(selector, {sort: {_id: -1}});

    return lastPayment;
};

// Get last payment except id
lastPaymentExceptId = function (registerId, exceptId, activeDate) {
    var lastPayment;
    var selector = {
        _id: {$ne: exceptId},
        registerId: registerId
    };
    if (!_.isUndefined(activeDate)) {
        selector.paymentDate = {$lte: activeDate};
    }
    lastPayment = School.Collection.Payment.findOne(selector, {sort: {_id: -1}});

    return lastPayment;
};