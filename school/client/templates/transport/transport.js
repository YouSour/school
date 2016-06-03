/**
 * Declare template
 */
var indexTpl = Template.school_transport,
  insertTpl = Template.school_transportInsert,
  updateTpl = Template.school_transportUpdate,
  showTpl = Template.school_transportShow,

  studentShowTpl = Template.school_studentShow;

/**
 * Declare state
 */
var state = new ReactiveObj({
  transportDate: '',
  term: 0,
  fromDAte: '',
  toDate: '',
  exchange: {},
  totalAmount: 0,
  submitType: 'save'
});

// Index
indexTpl.onCreated(function() {
  // SEO
  SEO.set({
    title: 'Transport',
    description: 'Description for this page'
  });

  createNewAlertify(['transport']);
});

indexTpl.helpers({
  selector: function() {
    var studentId = FlowRouter.getParam('studentId');
    return {
      studentId: studentId
    };
  },
  student: function() {
    var studentId = FlowRouter.getParam('studentId');
    var studentDoc = School.Collection.Student.findOne(studentId);
    studentDoc.photoUrl = null;

    if (!_.isUndefined(studentDoc.photo)) {
      studentDoc.photoUrl = Files.findOne(studentDoc.photo).url();
    }

    return studentDoc;
  }
});

indexTpl.events({
  'click .jsStudentInfo': function(e, t) {
    alertify.alert(fa("eye", "Student"), renderTemplate(studentShowTpl,
      this).html);
  },
  'click .insert': function(e, t) {
    alertify.transport(fa("plus", "Transport"), renderTemplate(insertTpl))
      .maximize();
  },
  'click .update': function(e, t) {
    var data = School.Collection.Transport.findOne(this._id);
    data.transportDate = moment(data.transportDate).format('YYYY-MM-DD');
    //data.voucherId = data.voucherId.slice(8);

    //setTimeout(function () {
    alertify.transport(fa("pencil", "Transport"), renderTemplate(
        updateTpl, data))
      .maximize();
    //}, 200);
  },
  'click .remove': function(e, t) {
    var self = this;

    alertify.confirm(
      fa("remove", "Transport"),
      "Are you sure to delete [" + self._id + "]?",
      function() {
        School.Collection.Transport.remove(self._id, function(error) {
          if (error) {
            alertify.error(error.message);
          } else {
            alertify.success("Success");
          }
        });
      },
      null
    );
  },
  'click .show': function(e, t) {
    var data = School.Collection.Transport.findOne({
      _id: this._id
    });
    //data.paymentMethodVal = JSON.stringify(data.paymentMethod);
    data.activeDate = moment(data.activeDate).format('DD-MM-YYYY');
    data.fromDate = moment(data.fromDate).format('DD-MM-YYYY');
    data.toDate = moment(data.toDate).format('DD-MM-YYYY');

    alertify.alert(fa("eye", "Transport"), renderTemplate(showTpl, data).html);
  },
  'click .printInvoice': function() {
    var params = {};
    var queryParams = {
      id: this._id
    };
    var path = FlowRouter.path("school.transportInvoiceReportGen", params,
      queryParams);

    window.open(path, '_blank');
  }
});

//Insert
insertTpl.onCreated(function() {
  configOnCreated();
});

insertTpl.onRendered(function() {
  configOnRendered();
});

insertTpl.helpers({
  studentId: function() {
    return FlowRouter.getParam('studentId');
  },
  fromDate: function() {
    return state.get('fromDate');
  },
  toDate: function() {
    var toDate = moment().format('YYYY-MM-DD');
    var fromDate = state.get('fromDate');
    var term = state.get('term');
    if (!_.isUndefined(fromDate) && !_.isEmpty(fromDate)) {
      toDate = moment(fromDate).add(term, 'months').toDate();
      toDate = moment(toDate).format('YYYY-MM-DD');
    }

    return toDate;
  },
  total: function() {
    var totalUsd, totalKhr = 0,
      totalThb = 0;
    totalUsd = _.isUndefined(state.get('totalAmount')) ? 0 : state.get(
      'totalAmount');

    // Exchange
    var exchange = state.get('exchange');
    if (!_.isEmpty(exchange)) {
      fx.base = exchange.base;
      fx.rates = exchange.rates;

      totalKhr = fx.convert(totalUsd, {
        from: "USD",
        to: "KHR"
      });
      totalKhr = roundKhr(totalKhr);
      totalThb = fx.convert(totalUsd, {
        from: "USD",
        to: "THB"
      });
      totalThb = math.round(totalThb);
    }

    return {
      totalUsd: totalUsd,
      totalKhr: totalKhr,
      totalThb: totalThb
    };
  },
  voucherId: function() {
    var currentBranch = Session.get('currentBranch');
    var transportDate = state.get('transportDate');
    var year = moment(transportDate).format("YYYY");
    var prefixVoucher = currentBranch + '-' + year;

    Fetcher.setDefault("voucherId", '');
    Fetcher.retrieve('voucherId', 'school_transportVoucherId',
      prefixVoucher);

    return Fetcher.get('voucherId');
  }
});

insertTpl.events({
  'change [name="exchangeId"]': function(e) {
    var exchange = Cpanel.Collection.Exchange.findOne($(e.currentTarget).val());
    state.set('exchange', exchange);
  },
  'change [name="itemId"]': function(e, t) {
    var itemId = $(e.currentTarget).val();
    // Set list state
    School.ListState.set(['transport', 'item'], itemId);

    state.set('term', 0);
    state.set('totalAmount', 0);
    $('[name="term"]').val('');
    $('[name="service"]').val('');
  },
  'change [name="term"]': function(e, t) {
    var term = $(e.currentTarget).val();
    if (term == '') {
      term = 0;
    }

    // Set list state
    School.ListState.set(['transport', 'term'], term);
    state.set('term', term);

    state.set('totalAmount', 0);
    $('[name="service"]').val('');
  },
  'change [name="service"]': function(e, t) {
    var walve = $('[name="walveAmount"]').val();
    var service = $(e.currentTarget).val();
    var totalAmount = 0;

    if (!_.isEmpty(service)) {
      service = JSON.parse(service);
      totalAmount = service.value - walve;
    }

    state.set('totalAmount', totalAmount);
  },
  'keyup  [name="walveAmount"]': function(e, t) {
    var totalAmount = 0;
    var serviceAmount = $('[name="service"]').val();
    var walveAmount = $(e.currentTarget).val();
    if (!_.isEmpty(serviceAmount)) {
      serviceAmount = JSON.parse(serviceAmount);
      totalAmount = serviceAmount.value - walveAmount;
    }

    state.set('totalAmount', totalAmount);
  },
  'click .save': function(e, t) {
    var submitType = e.currentTarget.id;
    // Set new submitType state
    state.set('submitType', submitType);
  }
});


//Update
updateTpl.onCreated(function() {
  configOnCreated();
});

updateTpl.onRendered(function() {
  configOnRendered();
});

updateTpl.helpers({
  fromDate: function() {
    return state.get('fromDate');
  },
  toDate: function() {
    var toDate = moment().format('YYYY-MM-DD');
    var fromDate = state.get('fromDate');
    var term = state.get('term');
    if (!_.isUndefined(fromDate) && !_.isEmpty(fromDate)) {
      toDate = moment(fromDate).add(term, 'months').toDate();
      toDate = moment(toDate).format('YYYY-MM-DD');
    }

    return toDate;
  },
  total: function() {
    var totalUsd, totalKhr = 0,
      totalThb = 0;
    totalUsd = _.isUndefined(state.get('totalAmount')) ? 0 : state.get(
      'totalAmount');

    // Exchange
    var exchange = state.get('exchange');
    if (!_.isEmpty(exchange)) {
      fx.base = exchange.base;
      fx.rates = exchange.rates;

      totalKhr = fx.convert(totalUsd, {
        from: "USD",
        to: "KHR"
      });
      totalKhr = roundKhr(totalKhr);
      totalThb = fx.convert(totalUsd, {
        from: "USD",
        to: "THB"
      });
      totalThb = math.round(totalThb);
    }

    return {
      totalUsd: totalUsd,
      totalKhr: totalKhr,
      totalThb: totalThb
    };
  }
});

updateTpl.events({
  'change [name="exchangeId"]': function(e) {
    var exchange = Cpanel.Collection.Exchange.findOne($(e.currentTarget).val());
    state.set('exchange', exchange);
  },
  'change [name="itemId"]': function(e, t) {
    var itemId = $(e.currentTarget).val();

    // Set list state
    School.ListState.set(['transport', 'item'], itemId);

    // Set list state
    //Meteor.setTimeout(function () {
    //    console.log('set timeout');
    //School.ListState.set(['transport', 'term'], 0);
    state.set('term', 0);
    state.set('totalAmount', 0);
    $('[name="term"]').val('');
    $('[name="service"]').val('');
    //}, 100);
  },
  'change [name="term"]': function(e, t) {
    var term = $(e.currentTarget).val();

    if (_.isUndefined(term) || _.isNull(term) || term == '') {
      term = 0;
    }
    // Set list state
    School.ListState.set(['transport', 'term'], term);
    state.set('term', term);

    //Meteor.setTimeout(function () {
    state.set('totalAmount', 0);
    $('[name="service"]').val();
    //}, 100);
  },
  'change [name="service"]': function(e, t) {
    var service = $(e.currentTarget).val();
    var walve = $('[name="walveAmount"]').val();
    var totalAmount = 0;

    if (!_.isEmpty(service)) {
      service = JSON.parse(service);
      totalAmount = service.value - walve;
    }

    state.set('totalAmount', totalAmount);
  },
  'keyup  [name="walveAmount"]': function(e, t) {
    var totalAmount = 0;
    var serviceAmount = $('[name="service"]').val();
    var walveAmount = $(e.currentTarget).val();
    if (!_.isEmpty(serviceAmount)) {
      serviceAmount = JSON.parse(serviceAmount);
      totalAmount = serviceAmount.value - walveAmount;
    }

    state.set('totalAmount', totalAmount);
  },
  'click .save': function(e, t) {
    var submitType = e.currentTarget.id;
    // Set new submitType state
    state.set('submitType', submitType)
  }
});

// Hook
AutoForm.hooks({
  school_transportInsert: {
    before: {
      insert: function(doc) {
        var currentBranch = Session.get('currentBranch');
        var prefixId = doc.studentId;
        doc._id = idGenerator.genWithPrefix(School.Collection.Transport,
          prefixId, 3);

        // Voucher
        //if (!_.isEmpty(doc.voucherId)) {
        //    var date = moment(doc.transportDate).format("YYYY");
        //    var prefixVoucher = currentBranch + '-' + date;
        //    doc.voucherId = prefixVoucher + s.pad(doc.voucherId, 6, "0");
        //}

        doc.cpanel_branchId = currentBranch;

        return doc;
      }
    },
    onSuccess: function(formType, result) {
      alertify.transport().close();
      alertify.success('Success');

      // Print invoice
      if (state.get('submitType') == 'savePrint') {
        var params = {};
        var queryParams = {
          id: result
        };
        var path = FlowRouter.path("school.transportInvoiceReportGen",
          params, queryParams);

        window.open(path, '_blank');
      }
    },
    onError: function(formType, error) {
      alertify.error(error.message);
    }
  },
  school_transportUpdate: {
    before: {
      update: function(doc) {
        var currentBranch = Session.get('currentBranch');

        // Voucher
        //if (!_.isEmpty(doc.$set.voucherId)) {
        //    var date = moment(doc.$set.transportDate).format("YYYY");
        //    var prefixVoucher = currentBranch + '-' + date;
        //    doc.$set.voucherId = prefixVoucher + s.pad(doc.voucherId, 6, "0");
        //}

        return doc;
      }
    },
    onSuccess: function(formType, result) {
      var doc = this.currentDoc;
      alertify.transport().close();
      alertify.success('Success');

      // Print invoice
      if (state.get('submitType') == 'savePrint') {
        var params = {};
        var queryParams = {
          id: doc._id
        };
        var path = FlowRouter.path("school.transportInvoiceReportGen",
          params, queryParams);

        window.open(path, '_blank');
      }
    },
    onError: function(formType, error) {
      alertify.error(error.message);
    }
  }
});

// Config on created, rendered
var configOnCreated = function() {
  // Clear state
  state.set([], {});
  School.ListState.set([], {});

  var fromDateVal = moment().format('YYYY-MM-DD');

  // Check form type
  var dataUpdate = Template.currentData();
  if (!_.isUndefined(dataUpdate)) {
    fromDateVal = moment(dataUpdate.fromDate).format('YYYY-MM-DD');

    // Set state
    School.ListState.set(['transport', 'item'], dataUpdate.itemId);
    School.ListState.set(['transport', 'term'], dataUpdate.term);

    state.set('exchange', dataUpdate._exchange);
    state.set('term', dataUpdate.term);
    state.set('totalAmount', dataUpdate.totalAmount);
  }

  // Set fromDate state
  state.set('fromDate', fromDateVal);
};

var configOnRendered = function() {
  var transportDate = $('[name="transportDate"]');
  state.set('transportDate', moment(transportDate).format('YYYY-MM-DD'));

  var fromDate = $('[name="fromDate"]');
  var toDate = $('[name="toDate"]');

  DateTimePicker.date([transportDate, fromDate, toDate]);
  Inputmask.currency($('[name="totalAmount"]'));

  /*** On change ***/
  transportDate.on("dp.change", function(e) {
    state.set('transportDate', moment(e.date).format('YYYY-MM-DD'));
  });
  fromDate.on("dp.change", function(e) {
    state.set('fromDate', moment(e.date).format('YYYY-MM-DD'));
  });
};
