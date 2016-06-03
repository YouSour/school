Meteor.startup(function () {
    if (Cpanel.Collection.Exchange.find().count() == 0) {
        Cpanel.Collection.Exchange.insert({
            _id: "D3vKHcoMB39fBPr8R",
            exDate: moment('2015-09-01').toDate(),
            base: "USD",
            rates: {
                KHR: 4000,
                USD: 1,
                THB: 30
            }
        });
    }
});