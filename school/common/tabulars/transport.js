School.TabularTable.Transport = new Tabular.Table({
  name: "schoolTransportList",
  collection: School.Collection.Transport,
  pagingType: "full_numbers",
  autoWidth: false,
  columnDefs: [{
    "width": "12px",
    "targets": 0
  }],
  order: [
    ['1', 'desc']
  ],
  columns: [{
    title: '<i class="fa fa-bars"></i>',
    tmpl: Meteor.isClient && Template.school_transportAction
  }, {
    data: "transportDate",
    title: "Tran Date",
    render: function(val, type, doc) {
      return moment(val).format('YYYY-MM-DD');
    }
  }, {
    data: "_item",
    title: "Item",
    render: function(val, type, doc) {
      if (_.isUndefined(val)) {
        return '';
      }
      return val.name + ' (' + val.zone + ')';
    }
  }, {
    data: "term",
    title: "Term"
  }, {
    data: "service",
    title: "Service",
    render: function(val, type, doc) {
      var valParse = JSON.parse(val);
      if (_.isUndefined(valParse)) {
        return '';
      }

      return valParse.name;
    }
  }, {
    data: "service",
    title: "Price",
    render: function(val, type, doc) {
      var valParse = JSON.parse(val);
      if (_.isUndefined(valParse)) {
        return '';
      }

      return valParse.value;
    }
  }, {
    data: "walveAmount",
    title: "Walve",
    render: function(val, type, doc) {
      return numeral(val).format('0,0.00');
    }
  }, {
    data: "totalAmount",
    title: "Amount",
    render: function(val, type, doc) {
      return numeral(val).format('0,0.00');
    }
  }, {
    data: "fromDate",
    title: "From Date",
    render: function(val, type, doc) {
      return moment(val).format('YYYY-MM-DD');
    }
  }, {
    data: "toDate",
    title: "To Date",
    render: function(val, type, doc) {
      return moment(val).format('YYYY-MM-DD');
    }
  }, {
    data: "voucherId",
    title: "Voucher",
    render: function(val, type, doc) {
      return (val).substr(8);
    }
  }]
});
