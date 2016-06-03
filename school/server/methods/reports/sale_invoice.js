Meteor.methods({
    school_saleInvoiceReport: function (params) {
        this.unblock();

        var data = {
            title: {},
            header: {},
            content: [{index: 'No Result'}],
            footer: {}
        };

        /****** Title *****/
        data.title = Cpanel.Collection.Company.findOne();

        /****** Header *****/
        var sale = School.Collection.Sale.findOne(params.id);

        // Exchange
        var exchange = Cpanel.Collection.Exchange.findOne(sale.exchangeId);
        sale.exchangeRate = exchange.rates;
        sale.exchangeStr = JSON.stringify(exchange.rates, null, ' ');

        var totalKhr, totalThb;
        fx.base = exchange.base;
        fx.rates = exchange.rates;

        totalKhr = fx.convert(sale.totalAmount, {from: "USD", to: "KHR"});
        sale.totalKhr = roundKhr(totalKhr);
        totalThb = fx.convert(sale.totalAmount, {from: "USD", to: "THB"});
        sale.totalThb = math.round(totalThb);

        data.header = sale;

        /****** Content *****/
        var content = [];
        var index = 1;
        sale.items.forEach(function (obj) {
            var itemDoc = School.Collection.SaleItem.findOne(obj.itemId);
            obj.index = index;
            obj.itemObj = itemDoc;

            content.push(obj);

            index++;
        });

        if (content.length > 0) {
            data.content = content;
        }

        return data
    }
});
