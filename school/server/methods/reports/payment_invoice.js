Meteor.methods({
    school_paymentInvoiceReport: function (params) {
        this.unblock();

        var data = {
            title: {},
            header: {},
            content: {},
            footer: {}
        };

        /****** Title *****/
        data.title = Cpanel.Collection.Company.findOne();

        /****** Content *****/
        var content = School.Collection.Payment.findOne(params.id);

        // Exchange
        var exchange = Cpanel.Collection.Exchange.findOne(content.exchangeId);
        content.exchangeRate = exchange.rates;
        content.paymentMethodObj = JSON.parse(content.paymentMethod);

        var totalKhr, totalThb;
        fx.base = exchange.base;
        fx.rates = exchange.rates;

        totalKhr = fx.convert(content.totalAmount, {from: "USD", to: "KHR"});
        content.totalKhr = roundKhr(totalKhr);
        totalThb = fx.convert(content.totalAmount, {from: "USD", to: "THB"});
        content.totalThb = math.round(totalThb);


        data.content = content;
        return data;
    }
});
