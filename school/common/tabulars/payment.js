School.TabularTable.Payment = new Tabular.Table({
  name: "schoolPaymentList",
  collection: School.Collection.Payment,
  pagingType: "full_numbers",
  autoWidth: false,
  columnDefs: [{
    "width": "12px",
    "targets": 0
  }],
  order: [
    ['1', 'desc'],
    ['9', 'desc']
  ],
  columns: [{
      title: '<i class="fa fa-bars"></i>',
      tmpl: Meteor.isClient && Template.school_paymentAction
    },
    //{data: "_id", title: "ID"},
    {
      data: "paymentDate",
      title: "Paid Date",
      render: function(val, type, doc) {
        return moment(val).format('YYYY-MM-DD');
      }
    },
    //{data: "paymentMethod", title: "Method"},
    {
      data: "dueAmount",
      title: "Due",
      render: function(val, type, doc) {
        return numeral(val).format('0,0.00');
      }
    }, {
      data: "discountAmount",
      title: "Discount",
      render: function(val, type, doc) {
        return numeral(val).format('0,0.00');
      }
    }, {
      data: "totalAmount",
      title: "Total",
      render: function(val, type, doc) {
        return numeral(val).format('0,0.00');
      }
    }, {
      data: "paidAmount",
      title: "Paid",
      render: function(val, type, doc) {
        return numeral(val).format('0,0.00');
      }
    },{
      data:"owedAmount",
      title:"owed Amount",
      render:function (val,type,doc) {
        return numeral(val).format('0,0.00');
      }
    },{
      data: "outstandingAmount",
      title: "Outstanding",
      render: function(val, type, doc) {
        return numeral(val).format('0,0.00');
      }
    }, {
      data: 'status',
      title: 'Status'
    },
    //{
    //    data: "fromDate",
    //    title: "From Date",
    //    render: function (val, type, doc) {
    //        return moment(val).format('YYYY-MM-DD');
    //    }
    //},
    {
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
    }, {
      data: "type",
      title: "Type"
    }

  ]
});
