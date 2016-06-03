Meteor.methods({
    school_paymentVoucherId: function (prefixVoucher) {
        var id = idGenerator.genWithPrefix(School.Collection.Payment, prefixVoucher, 6, 'voucherId');

        return id;
    },
    school_transportVoucherId: function (prefixVoucher) {
        var id = idGenerator.genWithPrefix(School.Collection.Transport, prefixVoucher, 6, 'voucherId');

        return id;
    },
    school_saleVoucherId: function (prefixVoucher) {
        var id = idGenerator.genWithPrefix(School.Collection.Sale, prefixVoucher, 6, 'voucherId');

        return id;
    }
});