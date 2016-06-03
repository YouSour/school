Meteor.methods({
  school_saleReport: function(params) {
    this.unblock();

    var data = {
      title: {},
      header: {},
      content: [{
        index: 'No Result'
      }],
      footer: {},
      sign: {}
    };

    var date = s.words(params.date, ' To ');
    var fDate = moment(date[0], 'YYYY-MM-DD').toDate();
    var tDate = moment(date[1], 'YYYY-MM-DD').add(1, 'days').toDate();

    /****** Title *****/
    data.title = Cpanel.Collection.Company.findOne();

    /****** Header *****/
    var paramsHeader = _.clone(params);
    var exchangeDoc = Cpanel.Collection.Exchange.findOne(params.exchange);
    paramsHeader.exchangeStr = JSON.stringify(exchangeDoc.rates, null, ' ');

    var branchDoc = Cpanel.Collection.Branch.findOne(params.branch);
    if (!_.isUndefined(branchDoc)) {
      paramsHeader.branch = branchDoc._id + " : " + branchDoc.enName;
    }

    data.header = paramsHeader;
    /****** Content *****/
    var content = [];
    var selector = {};

    selector.saleDate = {
      $gte: fDate,
      $lte: tDate
    };
    if (!_.isEmpty(params.branch)) {
      selector.cpanel_branchId = params.branch;
    }

    var index = 1;
    var subTotal = 0;
    School.Collection.Sale.find(selector, {
        sort: {
          saleDate: 1
        }
      })
      .forEach(function(obj) {
        // Do something
        obj.index = index;
        subTotal += obj.totalAmount;

        content.push(obj);

        index++;
      });

    // Exchange
    fx.base = exchangeDoc.base;
    fx.rates = exchangeDoc.rates;

    var subTotalKhr = fx.convert(subTotal, {
      from: 'USD',
      to: "KHR"
    });
    subTotalKhr = roundKhr(subTotalKhr);
    var subTotalThb = fx.convert(subTotal, {
      from: 'USD',
      to: "THB"
    });
    subTotalThb = math.round(subTotalThb);

    data.footer = {
      subTotal: subTotal,
      subTotalKhr: subTotalKhr,
      subTotalThb: subTotalThb
    };

    if (content.length > 0) {
      data.content = content;
    }

    return data;
  }
});
