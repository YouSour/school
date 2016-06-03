Meteor.methods({
  school_invoiceGroupReport: function(params) {
    this.unblock();

    var data = {
      title: {},
      header: {},
      content: [{
        index: 'No Result'
      }],
      contentTransport: [{
        index: 'No Result'
      }],
      footer: {}
    };

    /****** Title *****/
    data.title = Cpanel.Collection.Company.findOne();

    /****** Header *****/
    var student = School.Collection.Student.findOne(params.student);
    data.header = student;

    /****** Content *****/
    var content = [];
    var contentTransport = [];
    var selector = {};
    var selectorTransport = {};

    if (!_.isEmpty(params.transport)) {
      if (!_.isArray(params.transport)) {
        //if isn't array change to array
        params.transport = [params.transport];
      }
      // array
      selectorTransport._id = {
        $in: params.transport
      };
    }

    if (!_.isEmpty(params.studyPayment)) {
      if (!_.isArray(params.studyPayment)) {
        //if isn't array change to array
        params.studyPayment = [params.studyPayment];
      }
      // array
      selector._id = {
        $in: params.studyPayment
      };
    }

    //exchange
    var exchange = Cpanel.Collection.Exchange.findOne({
      _id: params.exchange
    });

    data.header.exchangeStr = JSON.stringify(exchange.rates, null, ' ');

    var paymentDoc = School.Collection.Payment.find(selector, {
      sort: {
        paymentDate: 1
      }
    });

    var sumTotal = 0;
    var sumPaid = 0;
    var sumOwed = 0;
    var sumOutstanding = 0;

    var totalKhr, paidKhr, owedKhr, outstandingKhr;
    var totalThb, paidThb, owedThb, outstandingThb;

    fx.base = exchange.base;
    fx.rates = exchange.rates;

    if (!_.isUndefined(paymentDoc)) {
      paymentDoc.forEach(function(obj) {

        obj.paymentMethodObj = JSON.parse(obj.paymentMethod).term +
          " Month(s)";

        sumTotal += obj.totalAmount;

        if (!_.isEmpty(selector)) {
          sumPaid += obj.paidAmount;
        }

        sumOwed += obj.owedAmount;
        sumOutstanding += obj.outstandingAmount;

        content.push(obj);
      });
    }

    //total Study
    if (!_.isEmpty(selector)) {
      // $
      data.footer.totalAmount = sumTotal;
      data.footer.totalPaidAmount = sumPaid;
      data.footer.totalOwedAmount = sumOwed;
      data.footer.totalOutstandingAmount = sumOutstanding;

      // KHR
      totalKhr = fx.convert(sumTotal, {
        from: "USD",
        to: "KHR"
      });

      paidKhr = fx.convert(sumPaid, {
        from: "USD",
        to: "KHR"
      });

      owedKhr = fx.convert(sumOwed, {
        from: "USD",
        to: "KHR"
      });

      outstandingKhr = fx.convert(sumOutstanding, {
        from: "USD",
        to: "KHR"
      });

      data.footer.totalKhrAmount = roundKhr(totalKhr);
      data.footer.paidKhrAmount = roundKhr(paidKhr);
      data.footer.owedKhrAmount = roundKhr(owedKhr);
      data.footer.outstandingKhrAmount = roundKhr(outstandingKhr);

      // THB
      totalThb = fx.convert(sumTotal, {
        from: "USD",
        to: "THB"
      });

      paidThb = fx.convert(sumPaid, {
        from: "USD",
        to: "THB"
      });

      owedThb = fx.convert(sumOwed, {
        from: "USD",
        to: "THB"
      });

      outstandingThb = fx.convert(sumOutstanding, {
        from: "USD",
        to: "THB"
      });

      data.footer.totatThbAmount = math.round(totalThb);
      data.footer.paidThbAmount = math.round(paidThb);
      data.footer.owedThbAmount = math.round(owedThb);
      data.footer.outstandingThbAmount = math.round(outstandingThb);
    }

    var sumTotalTransportPayment = 0;
    var totalTPKhr, totalTPThb;

    var transportDoc = School.Collection.Transport.find(
      selectorTransport);

    if (!_.isUndefined(transportDoc)) {
      transportDoc.forEach(function(obj) {
        obj.term = obj.term + " Month(s)";
        obj.serviceObj = JSON.parse(obj.service).name;
        if (!_.isEmpty(selectorTransport)) {
          sumTotalTransportPayment += obj.totalAmount;
        }
        contentTransport.push(obj);

      });
    }

    //

    //total Transport
    if (!_.isEmpty(selectorTransport)) {
      // $
      data.footer.totalTransportPayment = sumTotalTransportPayment;

      // KHR
      totalTPKhr = fx.convert(sumTotalTransportPayment, {
        from: "USD",
        to: "KHR"
      });
      data.footer.totalTransportPaymentKhr = roundKhr(totalTPKhr);

      //THB
      totalTPThb = fx.convert(sumTotalTransportPayment, {
        from: "USD",
        to: "THB"
      });
      data.footer.totalTransportPaymentThb = math.round(totalTPThb);

    }

    //grand Total
    var gTotalKhr, gTotalThb;
    // $
    data.footer.grandTotal = sumPaid +
      sumTotalTransportPayment;

    //KHR
    gTotalKhr = fx.convert(sumPaid +
      sumTotalTransportPayment, {
        from: "USD",
        to: "KHR"
      });
    data.footer.grandTotalKhr = roundKhr(gTotalKhr);

    //THB
    gTotalThb = fx.convert(sumPaid +
      sumTotalTransportPayment, {
        from: "USD",
        to: "THB"
      });
    data.footer.grandTotalThb = math.round(gTotalThb);

    if (content.length > 0 && contentTransport.length > 0) {
      if (!_.isEmpty(selector)) {
        data.content = content;
      }

      if (!_.isEmpty(selectorTransport)) {
        data.contentTransport = contentTransport;
      }
    }


    return data;
  }
});
